// JavaScript source code
import {job, outputs_model} from "./job_output_model.js"

class resource {
	constructor(name, symbol_url){
		this.name = name;
		this.symbol_url = symbol_url;
	}

}

class page_model {
	constructor(){

	this.om = new outputs_model();
	this.om.add_default_jobs();
	this.resource_List = [];
	this.set_resource_List();

	this.jobs_table = document.createElement('table');
	this.jobs_table.setAttribute("id", "jobs_matrix_table");
	this.set_jobs_table();
	this.edits_table = document.createElement('table');
	this.edits_table.setAttribute("id", "edits_table");

	this.boundGet = this.get_target.bind(this); // bound functions that utilize event listeners
	this.boundEdit = this.edit_jobs_table.bind(this);
	this.boundApply = this.apply_edit.bind(this);

	}

	set_resource_List() {
		let Energy_url = "https://stellaris.paradoxwikis.com/images/a/a9/Energy.png";
		let Min_url = "https://stellaris.paradoxwikis.com/images/1/10/Minerals.png";
		let Food_url = "https://stellaris.paradoxwikis.com/images/c/c6/Food.png";
		let Alloys_url = "https://stellaris.paradoxwikis.com/images/9/9a/Alloys.png";
		let Cg_url = "https://stellaris.paradoxwikis.com/images/f/fe/Consumer_goods.png";
		let Science_url = "https://stellaris.paradoxwikis.com/images/thumb/2/20/Research.png/24px-Research.png";
		let Energy = new resource("Energy", Energy_url);
		let Minerals = new resource("Minerals", Min_url);
		let Food = new resource("Food", Food_url);
		let Alloys = new resource("Alloys", Alloys_url);
		let Consumer_goods = new resource("Consumer goods", Cg_url);
		let Science = new resource("Science", Science_url);
		this.resource_List = [Energy, Minerals, Food, Alloys, Consumer_goods, Science];

	}


	get_target() {
		let target = [0,0,0,0,0,0];
		target[0] = document.getElementById('Ec_Target').value;
		target[1] = document.getElementById('Min_Target').value;
		target[2] = document.getElementById('Food_Target').value;
		target[3] = document.getElementById('Alloys_Target').value;
		target[4] = document.getElementById('Cg_Target').value;
		target[5] = document.getElementById('Science_Target').value;
		
		this.om.set_target(target);
		this.om.attain_target();
		document.getElementById("jobs_needed").innerHTML = this.om.jobs_needed;
;		
	}

	set_jobs_table() {
	this.jobs_table = document.createElement('table');
	this.jobs_table.setAttribute("id", "jobs_matrix_table");
		
	var c, r, t;
		t = this.jobs_table;
		t.width = 400;
		r = t.insertRow(); 
		c = r.insertCell();
		for (let resource of this.resource_List) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}
		for (let job of this.om.jobs_list) {
			r = t.insertRow();
			c = r.insertCell();
			c.innerHTML = "<img src= " + job.job_sybmol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			for ( let i in job.job_output_vector) {
				c = r.insertCell();
				c.innerHTML = job.job_vector[i];
				c.size = 1;
				//var x = document.createElement("INPUT");
				//x.setAttribute("type", "text");
				//c.appendChild(x);
			}
		}	
		var insertion_point = document.getElementById("table_insertion_point");
		document.body.insertBefore(t, insertion_point);
		 
	}

	edit_jobs_table() {

		this.edits_table = document.createElement('table');
		this.edits_table.setAttribute("id", "edits_table");	

		console.debug("editing jobs");

		document.getElementById("jobs_matrix_table").remove();
		var c, r, t;
		t = this.edits_table;
		t.width = 400;
		r = t.insertRow(); 
		c = r.insertCell();
		for (let resource of this.resource_List) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}
		for (let job of this.om.jobs_list) {
			r = t.insertRow();
			c = r.insertCell();
			c.innerHTML = "<img src= " + job.job_sybmol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			for ( let i in job.job_output_vector) {
				c = r.insertCell();
				
				var x = document.createElement("INPUT");
				x.setAttribute("size", 1);
				//x.setAttribute("type", "number");
				x.value = job.job_vector[i];
				//x.innerHTML = job.job_output_vector[i] - job.job_upkeep_vector[i] - job.pop_upkeep_vector[i];
				c.appendChild(x);
			}
		}
		
		var insertion_point = document.getElementById("table_insertion_point");
		document.body.insertBefore(t, insertion_point);
	
	var apply_button = document.createElement("button");
	apply_button.innerHTML = "Apply";
	apply_button.setAttribute("id", "apply_button");
	document.body.insertBefore(apply_button, document.getElementById("edit_jm_button"));
	document.getElementById("edit_jm_button").remove();
	document.getElementById("apply_button").addEventListener("click", this.boundApply);


	}

	apply_edit() {
	//look at the editable table and update the jobs model
	let t = this.edits_table;
	for (let i in t.rows) {
		if (i > 0) {
			let row = t.rows[i];
			for (let j in row.cells) {
				if (j > 0) {
					let cell = row.cells[j];
					let val = cell.children[0].value;
					this.om.jobs_list[i-1].job_vector[j-1] = parseFloat(val);
					
				}
			}  
		}
		
	}

	this.edits_table.remove();
	
	this.set_jobs_table();
	var edit_button = document.createElement("button");
	edit_button.innerHTML = "Edit";
	edit_button.setAttribute("id", "edit_jm_button");
	document.body.insertBefore(edit_button, document.getElementById("apply_button"));
	document.getElementById("apply_button").remove();
	document.getElementById("edit_jm_button").addEventListener("click", this.boundEdit);
	
	
	}

}

let pm = new page_model();
//pm.set_jobs_table();
//pm.edit_jobs_table();

document.getElementById("calculate_button").addEventListener("click", pm.boundGet);
document.getElementById("edit_jm_button").addEventListener("click", pm.boundEdit);

document.getElementById("jobs").innerHTML = "Technicians, Miners, Farmers, Metallurgists, Artisans, Researchers";
document.getElementById("resources").innerHTML = pm.om.resource_order