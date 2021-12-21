// JavaScript source code
import {job, resource, outputs_model} from "./job_output_model.js"

class page_model {
	constructor(){

	this.om = new outputs_model();
	this.om.add_default_jobs();
	this.om.add_default_resources();

	this.create_job_definition_table();
	this.create_resource_definition_table();
	this.jobs_table = document.createElement('table');
	this.jobs_table.setAttribute("id", "jobs_matrix_table");
	this.set_jobs_table();
	this.edits_table = document.createElement('table');
	this.edits_table.setAttribute("id", "edits_table");
	this.target_table = document.createElement("table");
	this.create_target_table();
	this.jobs_needed_table = document.createElement('table');
	this.create_jobs_needed_table();

	this.boundCalculate = this.calculate.bind(this); // bound functions that utilize event listeners
	this.boundEdit = this.edit_jobs_table.bind(this);
	this.boundApply = this.apply_edit.bind(this);

	}

	create_job_definition_table() {
		var c, r, t, h;
		t = document.createElement("table");
		t.style = "display: inline-block; padding-right: 20px";
		h = t.createTHead();		
		r = t.insertRow();
		r.style.fontWeight="bold";
		
		c = r.insertCell();
		c.innerHTML = "Job";
		c = r.insertCell();
		c.innerHTML = "Symbol";

		for (let job of this.om.jobs_list) {
			r = t.insertRow();
			c = r.insertCell();
			c.innerHTML = job.job_name;
			c = r.insertCell();
			c.innerHTML = "<img src= " + job.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}

		document.body.insertBefore(t, document.getElementById("jobs"))

	}

	create_resource_definition_table() {
		var c, r, t;
		t = document.createElement("table");
		t.style = "display: inline-block";
		r = t.insertRow();
		r.style.fontWeight="bold";

		c = r.insertCell();
		c.innerHTML = "Resource";
		c = r.insertCell();
		c.innerHTML = "Symbol";
		console.debug(this.om.resources_list);
		for (let resource of this.om.resources_list) {
			r = t.insertRow();
			c = r.insertCell();
			c.innerHTML = resource.name;
			c = r.insertCell();
			c.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}

		document.body.insertBefore(t, document.getElementById("jobs"))

	}

	create_target_table() {
		var c, r, t;
		t = this.target_table;
		t.width = 400;
		r = t.insertRow(); 
		c = r.insertCell();
		for (let resource of this.om.resources_list) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}
		r = t.insertRow();
		c = r.insertCell();
		c.innerHTML = "Resource Targets: "
		for (let i in this.om.resources_list) {
			c = r.insertCell();
				
			var x = document.createElement("INPUT");
			x.setAttribute("size", 1);
			//x.setAttribute("type", "number");
			x.value = 0;
				//x.innerHTML = job.job_output_vector[i] - job.job_upkeep_vector[i] - job.pop_upkeep_vector[i];
			c.appendChild(x);
		}

		document.body.insertBefore(t, document.getElementById("targets_insertion_point"));
	}

	create_jobs_needed_table() {
		var c, r, t;
		t = this.jobs_needed_table;
		t.width = 400;
		r = t.insertRow(); 
		c = r.insertCell();
		for (let job of this.om.jobs_list) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + job.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
		}
		r = t.insertRow();
		c = r.insertCell();
		c.innerHTML = "Jobs Needed: ";
		for (let i in this.om.resources_list) {
			c = r.insertCell();
			c.innerHTML = 0;	
			
		}

		document.body.insertBefore(t, document.getElementById("jobs_needed_insertion_point"));

	}


	calculate() {
		let target = [0,0,0,0,0,0];
		var t = this.target_table;
			
			let row = t.rows[1];
				for (let j in row.cells) {
					if (j > 0) {
						let cell = row.cells[j];
						let val = cell.children[0].value;
						target[j-1] = parseFloat(val);
					
					}
				}  
		this.om.set_target(target);
		this.om.attain_target();
		//document.getElementById("jobs_needed").innerHTML = this.om.jobs_needed;

		t = this.jobs_needed_table;
		row = t.rows[1];
		for (let j in row.cells) {
			if (j > 0) {
				let cell = row.cells[j];
				cell.innerHTML = this.om.jobs_needed[j-1];
			}
		}
		let x = 0;
		for (let i of this.om.jobs_needed) {
			x += parseFloat(i);
		}
;		document.getElementById("total_jobs").innerHTML = "total jobs needed: " + String(x.toFixed(1));
	}

	set_jobs_table() {
	this.jobs_table = document.createElement('table');
	this.jobs_table.setAttribute("id", "jobs_matrix_table");
		
	var c, r, t;
		t = this.jobs_table;
		t.width = 400;
		r = t.insertRow(); 
		c = r.insertCell();
		for (let resource of this.om.resources_list) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}
		for (let job of this.om.jobs_list) {
			r = t.insertRow();
			c = r.insertCell();
			c.innerHTML = "<img src= " + job.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			for ( let i in job.job_output_vector) {
				c = r.insertCell();
				c.innerHTML = job.job_vector[i];
				c.style.fontWeight="bold";
				if (job.job_vector[i]>0) {
					c.style.color = "green";
				}
				if (job.job_vector[i] < 0) {
					c.style.color = "red";
				}
				
				if (job.job_vector[i] == 0) {
					c.style.color = "orange";
				}
				
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
		for (let resource of this.om.resources_list) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}
		for (let job of this.om.jobs_list) {
			r = t.insertRow();
			c = r.insertCell();
			c.innerHTML = "<img src= " + job.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
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

document.getElementById("calculate_button").addEventListener("click", pm.boundCalculate);
document.getElementById("edit_jm_button").addEventListener("click", pm.boundEdit);