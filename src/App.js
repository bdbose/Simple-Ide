import './App.css';
import Select from 'react-select';
import React, { useState } from 'react';
import Axios from 'axios';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

const options = [
	{ value: 'javascript', label: 'javascript' },
	{ value: 'python', label: 'python' },
];
const defValue = `function add(){
  return "First Compile then Run The Code....."
}
console.log(add())`;
function App() {
	const [source, setsource] = useState(defValue);
	const [id, setId] = useState('');
	const [output, setoutput] = useState('');
	const [input, setinput] = useState('');
	const [selectedOption, setselectedOption] = useState({
		value: 'javascript',
		label: 'javascript',
	});
	function onChange(newValue) {
		setsource(newValue);
	}

	const handleChange = (selected) => {
		setselectedOption(selected);
	};

	const Compile = async () => {
		await Axios.post(
			`http://api.paiza.io:80/runners/create?source_code=${source}&language=${selectedOption.value}&input=${input}&api_key=guest`
		).then(({ data }) => {
			setId(data.id);
			console.log(data.id);
		});
	};

	const Run = async () => {
		await Axios.get(
			`http://api.paiza.io:80/runners/get_details?id=${id}&api_key=guest`
		).then(({ data }) => {
			if (data.stderr) {
				setoutput(data.stderr);
				setId(null);
				return;
			}
			setoutput(data.stdout);
			setId(null);
		});
	};
	return (
		<div className='App'>
			<div className='title'>Online IDE</div>
			<div className='select-div'>
				<div className='title-div'>Select Language</div>
				<Select
					value={selectedOption}
					onChange={handleChange}
					options={options}
				/>
			</div>
			<div className='cover'>
				<div className='editor-div'>
					<div className='title-div'>Write Your Code:</div>

					<AceEditor
						defaultValue={defValue}
						width='50vw'
						showPrintMargin={true}
						showGutter={true}
						highlightActiveLine={true}
						mode={selectedOption.value}
						// mode='python'
						theme='monokai'
						fontSize={16}
						onChange={onChange}
						name='UNIQUE_ID_OF_DIV'
						editorProps={{ $blockScrolling: true }}
						setOptions={{
							tabSize: 2,
						}}
					/>
					<button onClick={Compile}>Compile</button>
					{id ? (
						<button style={{ backgroundColor: 'red' }} onClick={Run}>
							Run
						</button>
					) : (
						<button
							style={{ backgroundColor: 'brown', cursor: 'not-allowed' }}
							disabled>
							Run
						</button>
					)}
				</div>
				<div className='box-container'>
					<div className='box'>
						<div>Input:</div>
						<textarea onChange={(e) => setinput(e.target.value)} />
					</div>
					<div className='box'>
						<div>Output:</div>
						<textarea value={output} disabled />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
