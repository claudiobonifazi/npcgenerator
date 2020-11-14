import React from 'react';
import './Radiusvisual.css';

class Radiusvisual extends React.Component{

    static defaultProps = {
        min: 0,
        max: 20,
        mainColor: "red",
        lineColor: "#ccc",
        textColor: "#000",
        helperCircles: true,
        startAngle: -Math.PI/2,
        values: []
    };

    state = {

    };

    canvas = null;
    ctx = null;

    constructor(props){
        super(props);
        this.canvas = React.createRef();
        window.test = this;
    }

    render(){
        let html = <div className="radvis_container" style={this.props.style}>
                        <canvas className="radvis_canvas" ref={this.canvas} />
                    </div>;
        return html;
    }

    componentDidMount(){
        this.ctx = this.canvas.current.getContext('2d');

        let size = this.canvas.current.parentElement.getBoundingClientRect();
        this.canvas.current.width = size.width;
        this.canvas.current.height = size.width;

        this.draw();
    }

    componentDidUpdate(){
        
        
        let size = this.canvas.current.parentElement.getBoundingClientRect();
        this.canvas.current.width = size.width;
        this.canvas.current.height = size.width;

        this.draw();
    }

    draw(){
        console.time("draw");
        this.ctx.save();

        let center = { x: this.canvas.current.width/2, y: this.canvas.current.height/2 };
        let centerCircRad = center.x/10;
        let dotRad = center.x/100;
        let outerRad = center.x * 0.75;
        let stepRad = ( outerRad - centerCircRad ) / ( this.props.max - this.props.min );

        this.ctx.strokeStyle = this.props.lineColor;

        // center circle
        this.ctx.beginPath();
        this.ctx.arc( center.x, center.y, centerCircRad, 0, 2*Math.PI );
        this.ctx.stroke();

        // helper circles
        if( this.props.helperCircles ){
            this.ctx.globalAlpha = 0.3;
            for( let i = this.props.min; i <= this.props.max; i++ ){
                this.ctx.beginPath();
                this.ctx.arc( 
                            center.x, 
                            center.y, 
                            centerCircRad + i * stepRad, 
                            0, 
                            2*Math.PI 
                        );
                this.ctx.stroke();
            }
            this.ctx.globalAlpha = 1;
        }

        this.props.values.map((el,i)=>{
            let angle = i * 2 * Math.PI/this.props.values.length + this.props.startAngle;

            // radial long line
            this.ctx.beginPath();
            this.ctx.moveTo( 
                        center.x + centerCircRad * Math.cos(angle),
                        center.y + centerCircRad * Math.sin(angle),
                    );
            this.ctx.lineTo(
                        center.x + (outerRad-dotRad) * Math.cos(angle),
                        center.y + (outerRad-dotRad) * Math.sin(angle),
                    );
            this.ctx.stroke();

            // dot at the end
            let dotPos = {
                x: center.x + ( outerRad  ) * Math.cos(angle),
                y: center.y + ( outerRad  ) * Math.sin(angle), 
            };
            this.ctx.beginPath();
            this.ctx.arc( dotPos.x, dotPos.y, dotRad, 0, 2*Math.PI );
            this.ctx.stroke();

            // label
            if( el.name ){
                this.ctx.save();
                let fontSize = Math.max( dotRad*2, 10 );
                this.ctx.font = "bold "+fontSize+"px Arial";
                this.ctx.fillStyle = this.props.mainColor;
                let textWidth = this.ctx.measureText(el.name.toUpperCase());
                let textMargin = 10;
                let labelWidth = textWidth.actualBoundingBoxRight;
                labelWidth = Math.min( labelWidth, (center.x - outerRad) );
                let textX = dotPos.x + dotRad + textMargin;
                let textY = dotPos.y + dotRad/2;
                let angPos = { x: Math.cos(angle), y: Math.sin(angle) };
                if( angPos.x < 0.1 && angPos.x > -0.1 ){
                    if( angPos.y < 0 ){
                        textY -= dotRad * 3 + textMargin;
                    }else{
                        textY += dotRad * 3 + textMargin;
                    }
                    textX -= labelWidth/2;
                }else{
                    if( angPos.x <= -0.1 ){
                        textX = dotPos.x - labelWidth  - textMargin*2 - this.ctx.measureText("["+el.value+"]").actualBoundingBoxRight;
                    }
                }
                this.ctx.fillText( el.name.toUpperCase(), textX, textY, labelWidth );
                this.ctx.fillStyle = this.props.lineColor;
                this.ctx.fillText( "["+el.value+"]", textX+labelWidth+textMargin, textY );
                this.ctx.restore();
            }
        });

        // values' representation
        this.ctx.fillStyle = this.props.mainColor;
        let prevEl = null, firstEl = null;
        this.props.values.map((el,i)=>{
            let angle = i * 2 * Math.PI/this.props.values.length + this.props.startAngle;

            // color dot
            let colorDot = { 
                x: center.x + ( centerCircRad + stepRad * el.value  ) * Math.cos(angle),
                y: center.y + ( centerCircRad + stepRad * el.value  ) * Math.sin(angle), 
            };
            if( typeof el.value === 'number' && el.value >= this.props.min && el.value <= this.props.max ){
                this.ctx.beginPath();
                this.ctx.arc( colorDot.x, colorDot.y, dotRad, 0, 2*Math.PI );
                this.ctx.fill();
            }

            if( prevEl ){
                // line to previous color dot
                this.ctx.save();
                this.ctx.strokeStyle = this.props.mainColor;
                this.ctx.lineWidth = Math.max( dotRad/5, 1 );
                this.ctx.beginPath();
                this.ctx.moveTo( colorDot.x, colorDot.y );
                this.ctx.lineTo( prevEl.x, prevEl.y );
                this.ctx.stroke();

                if( i === this.props.values.length - 1 ){
                    // last line
                    this.ctx.beginPath();
                    this.ctx.moveTo( colorDot.x, colorDot.y );
                    this.ctx.lineTo( firstEl.x, firstEl.y );
                    this.ctx.stroke();
                }
                this.ctx.restore();

            }

            prevEl = colorDot;
            if( i === 0 ){
                firstEl = colorDot;
            }
        });

        // filled area
        this.ctx.save();
        this.ctx.globalAlpha = 0.667;
        this.ctx.beginPath();
        this.props.values.map((el,i)=>{
            let angle = i * 2 * Math.PI/this.props.values.length + this.props.startAngle;

            // color dot
            let colorDot = { 
                x: center.x + ( centerCircRad + stepRad * el.value  ) * Math.cos(angle),
                y: center.y + ( centerCircRad + stepRad * el.value  ) * Math.sin(angle), 
            };
            if( typeof el.value === 'number' && el.value >= this.props.min && el.value <= this.props.max ){
                if( i === 0 ){
                    this.ctx.moveTo( colorDot.x, colorDot.y );
                }else{
                    this.ctx.lineTo( colorDot.x, colorDot.y );
                }
            }
            if( i === 0 ){
                firstEl = el;
            }  
        });
        if( firstEl ){
            this.ctx.lineTo( firstEl.x, firstEl.y );
        }
        this.ctx.fill();
        this.ctx.restore();




        this.ctx.restore();
        console.timeEnd("draw");
    }
}

export default Radiusvisual;
