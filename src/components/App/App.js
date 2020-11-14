import React from 'react';
import Radiusvisual from '../Radiusvisual/Radiusvisual';
import './App.css';

class App extends React.Component{

	state = {
		values: [
			{ name: "bulk apperception", value: 14 },
			{ name: "candor", value: 19 },
			{ name: "vivacity", value: 17 },
			{ name: "coordination", value: 10 },
			{ name: "meekness", value: 2 },
			{ name: "humility", value: 3 },
			{ name: "cruelty", value: 1 },
			{ name: "self-preservation", value: 10 },
			{ name: "patience", value: 3 },
			{ name: "decisiveness", value: 14 },
			{ name: "imagination", value: 13 },
			{ name: "curiosity", value: 8 },
			{ name: "aggression", value: 5 },
			{ name: "loyalty", value: 16 },
			{ name: "empathy", value: 9 },
			{ name: "tenacity", value: 17 },
			{ name: "courage", value: 15 },
			{ name: "sensuality", value: 18 },
			{ name: "charm", value: 18 },
			{ name: "humor", value: 9 },
		],
	}

	render(){

		let proveForm = <form>
							<fieldset>
								{ this.state.values.map( (el,i) => 
									<label key={i}>
										{el.name}
										<input type="number" min={0} max={20} step={1} placeholder={el.name} value={el.value} data-k={i} onChange={this.changeVal.bind(this)} onFocus={(e=>{e.target.select()}).bind(this)} />
									</label>
								) }
							</fieldset>
						</form>


		return <div>
					<Radiusvisual values={this.state.values} style={{width:800}} mainColor="#408598" />
					<hr/>
					{proveForm}
				</div>;
	}

	changeVal( e ){
		let tmp = this.state;
		tmp.values[parseInt(e.target.dataset.k)].value = parseInt(e.target.value||0);
		this.setState(tmp);
	}
}

export default App;
