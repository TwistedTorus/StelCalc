// JavaScript source code
import {job, resource, modifier, outputs_model} from "./job_output_model.js"

class page_model {
	constructor(){

	this.om = new outputs_model();
	this.om.apply_modifiers();
	this.calculation_mode = "r_to_j";

	//this.om.add_default_jobs();
	//this.om.add_default_resources();

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

	this.jobs_given_table = document.createElement("table");
	this.resources_out_table = document.createElement("table");
	this.create_job_base_oup_tables();
	this.create_modifier_tables();

	this.boundCalculate = this.calculate.bind(this); // bound functions that utilize event listeners
	this.boundEdit = this.edit_jobs_table.bind(this);
	this.boundApply = this.apply_edit.bind(this);
	this.boundSwapMode = this.swap_calculation_mode.bind(this);
	this.boundModifierEdit = this.edit_by_modifiers.bind(this);
	this.boundApplyModifierEdit = this.apply_modifier_edit.bind(this);
	
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
		this.target_table = document.createElement("table");
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
		c.innerHTML = " "
		for (let i in this.om.resources_list) {
			c = r.insertCell();
				
			var x = document.createElement("INPUT");
			//x.setAttribute("size", 1);
			//x.setAttribute("type", "number");
			x.value = 0;
				//x.innerHTML = job.job_output_vector[i] - job.job_upkeep_vector[i] - job.pop_upkeep_vector[i];
			c.appendChild(x);
		}

		document.body.insertBefore(t, document.getElementById("targets_insertion_point"));
	}

	create_jobs_given_table() {
		var c, r, t;
		this.jobs_given_table = document.createElement("table");
		t = this.jobs_given_table;
		t.width = 400;
		r = t.insertRow(); 
		c = r.insertCell();
		for (let job of this.om.jobs_list) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + job.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
		}
		r = t.insertRow();
		c = r.insertCell();
		c.innerHTML = " "
		for (let i in this.om.jobs_given) {
			c = r.insertCell();
				
			var x = document.createElement("INPUT");
			//x.setAttribute("size", 1);
			//x.setAttribute("type", "number");
			x.value = 0;
				//x.innerHTML = job.job_output_vector[i] - job.job_upkeep_vector[i] - job.pop_upkeep_vector[i];
			c.appendChild(x);
		}

		document.body.insertBefore(t, document.getElementById("targets_insertion_point"));

	}

	create_jobs_needed_table() {
		var c, r, t;
		this.jobs_needed_table = document.createElement("table");
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
		c.innerHTML = " ";
		for (let i in this.om.resources_list) {
			c = r.insertCell();
			c.innerHTML = 0;
			c.style.fontWeight="bold";
			
		}

		document.body.insertBefore(t, document.getElementById("jobs_needed_insertion_point"));

	}

	create_resources_out_table() {
		var c, r, t;
		this.resources_out_table =  document.createElement("table");
		t = this.resources_out_table;
		t.width = 400;
		r = t.insertRow(); 
		c = r.insertCell();
		for (let resource of this.om.resources_list) {
			c = r.insertCell();
			c.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
		}
		r = t.insertRow();
		c = r.insertCell();
		c.innerHTML = " ";
		for (let i in this.om.resources_list) {
			c = r.insertCell();
			c.innerHTML = 0;
			c.style.fontWeight="bold";
			if (this.om.resources_out[i]>0) {
				c.style.color = "green";
				}
			if (this.om.resources_out[i] < 0) {
				c.style.color = "red";
				}
				
			if (this.om.resources_out[i] == 0) {
				c.style.color = "orange";
				
				}
			
		}

		document.body.insertBefore(t, document.getElementById("jobs_needed_insertion_point"));

	}

	swap_calculation_mode() {

		if (this.calculation_mode == "r_to_j") {
			this.calculation_mode = "j_to_r";
			this.target_table.remove();
			this.jobs_needed_table.remove();
			this.create_jobs_given_table();
			this.create_resources_out_table();
			document.getElementById("inputs_title").innerHTML = "Jobs Given Vector";
			document.getElementById("outputs_title").innerHTML = "Net Resource Vector";
			document.getElementById("how_to_use").innerHTML = "State how many of each job you have and the calculator will determine the net resource outputs";

		}

		else {
			this.calculation_mode = "r_to_j";
			this.jobs_given_table.remove();
			this.resources_out_table.remove();
			this.create_target_table();
			this.create_jobs_needed_table();
			document.getElementById("inputs_title").innerHTML = "Net Resource Target Vector";
			document.getElementById("outputs_title").innerHTML = "Jobs Needed Vector";
			document.getElementById("how_to_use").innerHTML = "Set a target for resource outputs and this calculator will determine how many of each job you will need to reach that target.";
		}

	}

	calculate() {
		if (this.calculation_mode == "r_to_j") {
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
			this.om.attain_jobs_for_target();
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
		
			document.getElementById("total_jobs").innerHTML = "total jobs: " + String(x.toFixed(1));
		
		}
		
		if (this.calculation_mode == "j_to_r") {
			let jobs_given = [0,0,0,0,0,0];
			var t = this.jobs_given_table;
			
				let row = t.rows[1];
					for (let j in row.cells) {
						if (j > 0) {
							let cell = row.cells[j];
							let val = cell.children[0].value;
							jobs_given[j-1] = parseFloat(val);
					
						}
					}  
			this.om.jobs_given = jobs_given;
			this.om.attain_resources_from_jobs();

			t = this.resources_out_table;
			row = t.rows[1];
			for (let j in row.cells) {
				if (j > 0) {
					let c = row.cells[j];
					c.innerHTML = this.om.resources_out[j-1];
					if (this.om.resources_out[j-1]>0) {
						c.style.color = "green";
						}
					if (this.om.resources_out[j-1] < 0) {
						c.style.color = "red";
						}
				
					if (this.om.resources_out[j-1] == 0) {
						c.style.color = "orange";
						}
				}
			}
			let x = 0;
			for (let i of this.om.jobs_given) {
				x += parseFloat(i);
			}
		
			document.getElementById("total_jobs").innerHTML = "total jobs: " + String(x.toFixed(1));
		}


	}

	set_jobs_table() {
	this.jobs_table = document.createElement('table');
	this.jobs_table.setAttribute("id", "jobs_matrix_table");
		
	var c, r, t;
		t = this.jobs_table;
		let tcap = t.createCaption();
		tcap.innerHTML = "Job Net Resource Outputs table";
		tcap.style.fontWeight="bold";
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
				c.innerHTML = job.job_vector[i].toPrecision(3);
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

		this.jobs_table.remove();
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
	document.getElementById("edit_by_modifiers_button").remove();
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
	edit_button.innerHTML = "Directly Edit Jobs";
	edit_button.setAttribute("id", "edit_jm_button");
	document.body.insertBefore(edit_button, document.getElementById("apply_button"));
	document.getElementById("edit_jm_button").addEventListener("click", this.boundEdit);
	this.edit_by_modifiers_button = document.createElement("button");
	this.edit_by_modifiers_button.innerHTML = "Edit Jobs by Modifiers";
	this.edit_by_modifiers_button.setAttribute("id", "edit_by_modifiers_button");
	this.edit_by_modifiers_button.addEventListener("click", this.boundModifierEdit);
	document.body.insertBefore(this.edit_by_modifiers_button, document.getElementById("apply_button"));
	document.getElementById("apply_button").remove();

	}

	create_job_base_oup_tables() {
		this.job_base_o_table = document.createElement("table");
		this.job_base_u_table = document.createElement("table");
		this.job_base_p_table = document.createElement("table");

		var c1, c2, c3, r1, r2, r3, t1, t2, t3;
		t1 = this.job_base_o_table;
		t2 = this.job_base_u_table;
		t3 = this.job_base_p_table;
		t1.style = "display: inline-block; padding-right: 10px";
		t2.style = "display: inline-block; padding-right: 10px";
		t3.style = "display: inline-block;";
		let t1Caption = t1.createCaption();
		t1Caption.innerHTML = "Base Job Outputs";
		t1Caption.style.fontWeight= "bold";
		let t2Caption = t2.createCaption();
		t2Caption.innerHTML = "Base Job Upkeeps";
		t2Caption.style.fontWeight= "bold";
		let t3Caption = t3.createCaption();
		t3Caption.innerHTML = "Pop Upkeeps";
		t3Caption.style.fontWeight= "bold";
		
		t1.width = 400;
		t2.width = 400;
		t3.width = 400;
		r1 = t1.insertRow(); 
		c1 = r1.insertCell();
		r2 = t2.insertRow(); 
		c2 = r2.insertCell();
		r3 = t3.insertRow(); 
		c3 = r3.insertCell();
		
		for (let resource of this.om.resources_list) {
			c1 = r1.insertCell();
			c1.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
			c2 = r2.insertCell();
			c2.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
			c3 = r3.insertCell();
			c3.innerHTML = "<img src= " + resource.symbol_url + " alt=\"Resource_Symb\" width=\"20\" height=\"20\"> ";
			}
		
		for (let job of this.om.jobs_list) {
			r1 = t1.insertRow();
			c1 = r1.insertCell();
			c1.innerHTML = "<img src= " + job.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			r2 = t2.insertRow();
			c2 = r2.insertCell();
			c2.innerHTML = "<img src= " + job.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			r3 = t3.insertRow();
			c3 = r3.insertCell();
			c3.innerHTML = "<img src= " + job.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
		
			for ( let i in job.job_output_vector) {
				c1 = r1.insertCell();
				var x1 = document.createElement("INPUT");
				x1.setAttribute("size", 1);
				x1.value = job.job_output_vector[i];
				c1.appendChild(x1);

				c2 = r2.insertCell();
				var x2 = document.createElement("INPUT");
				x2.setAttribute("size", 1);
				x2.value = job.job_upkeep_vector[i];
				c2.appendChild(x2);

				c3 = r3.insertCell();
				var x3 = document.createElement("INPUT");
				x3.setAttribute("size", 1);
				x3.value = job.pop_upkeep_vector[i];
				c3.appendChild(x3);
			}
		}
	}

	show_job_base_oup_tables() {

		var insertion_point = document.getElementById("table_insertion_point");
		document.body.insertBefore(this.job_base_o_table, insertion_point);
		document.body.insertBefore(this.job_base_u_table, insertion_point);
		document.body.insertBefore(this.job_base_p_table, insertion_point);

		document.body.insertBefore(this.stratum_mod_table, insertion_point);
		document.body.insertBefore(this.job_specific_output_mod_table, insertion_point);
		document.body.insertBefore(this.job_specific_upkeep_mod_table, insertion_point);
		document.body.insertBefore(this.pop_upkeep_mod_table, insertion_point);

	}

	hide_job_base_oup_table() {

		this.job_base_o_table.remove();
		this.job_base_u_table.remove();
		this.job_base_p_table.remove();

		this.stratum_mod_table.remove();
		this.job_specific_output_mod_table.remove();
		this.job_specific_upkeep_mod_table.remove();
		this.pop_upkeep_mod_table.remove();

	}

	create_modifier_tables(){
		this.stratum_mod_table = document.createElement("table");
		this.job_specific_output_mod_table = document.createElement("table");
		this.job_specific_upkeep_mod_table = document.createElement("table");
		this.pop_upkeep_mod_table = document.createElement("table");

		let t1Cap = this.stratum_mod_table.createCaption();
		t1Cap.innerHTML = "Stratum Modifiers";
		let t2Cap = this.job_specific_output_mod_table.createCaption();
		t2Cap.innerHTML = "Job Specific Output Modifiers";
		let t3Cap = this.job_specific_upkeep_mod_table.createCaption();
		t3Cap.innerHTML = "Job Specific Upkeep Modifiers";
		let t4Cap = this.pop_upkeep_mod_table.createCaption();
		t4Cap.innerHTML = "Pop Upkeep Modifiers";
		t1Cap.style.fontWeight="bold";
		t2Cap.style.fontWeight="bold";
		t3Cap.style.fontWeight="bold";
		t4Cap.style.fontWeight="bold";

		this.stratum_output_modifiers = [];
		this.job_specific_output_modifiers = [];
		this.job_specific_upkeep_modifiers = [];
		this.pop_upkeep_modifiers = [];

		for (let modifier of this.om.stratum_output_modifiers) {
			let row = this.stratum_mod_table.insertRow();
			let mod_symb_cell = row.insertCell();
			mod_symb_cell.innerHTML = "<img src= " + modifier.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			let mod_name_cell = row.insertCell();
			mod_name_cell.innerHTML = modifier.name;
			let mod_val_cell = row.insertCell();
			let x = document.createElement("INPUT");
			x.value = modifier.perc_boost;
			mod_val_cell.appendChild(x);
		}

		for (let modifier of this.om.job_specific_output_modifiers) {
			let row = this.job_specific_output_mod_table.insertRow();
			let mod_symb_cell = row.insertCell();
			mod_symb_cell.innerHTML = "<img src= " + modifier.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			let mod_name_cell = row.insertCell();
			mod_name_cell.innerHTML = modifier.name;
			let mod_val_cell = row.insertCell();
			let x = document.createElement("INPUT");
			x.value = modifier.perc_boost;
			mod_val_cell.appendChild(x);
		}
		for (let modifier of this.om.job_specific_upkeep_modifiers) {
			let row = this.job_specific_upkeep_mod_table.insertRow();
			let mod_symb_cell = row.insertCell();
			mod_symb_cell.innerHTML = "<img src= " + modifier.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			let mod_name_cell = row.insertCell();
			mod_name_cell.innerHTML = modifier.name;
			let mod_val_cell = row.insertCell();
			let x = document.createElement("INPUT");
			x.value = modifier.perc_boost;
			mod_val_cell.appendChild(x);
		}
		for (let modifier of this.om.pop_upkeep_modifiers) {
			let row = this.pop_upkeep_mod_table.insertRow();
			let mod_symb_cell = row.insertCell();
			mod_symb_cell.innerHTML = "<img src= " + modifier.symbol_url + " alt=\"Job_Symb\" width=\"20\" height=\"20\"> ";
			let mod_name_cell = row.insertCell();
			mod_name_cell.innerHTML = modifier.name;
			let mod_val_cell = row.insertCell();
			let x = document.createElement("INPUT");
			x.value = modifier.perc_boost;
			mod_val_cell.appendChild(x);
		}

	}

	edit_by_modifiers() {

		this.show_job_base_oup_tables();
		this.apply_modifiers_button = document.createElement("button");
		this.apply_modifiers_button.innerHTML = "Apply Modifier Edit";
		this.apply_modifiers_button.addEventListener("click", this.boundApplyModifierEdit);
		document.body.insertBefore(this.apply_modifiers_button, document.getElementById("edit_by_modifiers_button"));
		document.getElementById("edit_by_modifiers_button").remove();
		document.getElementById("edit_jm_button").remove();
	}

	isPositiveInteger(n) {
		return n >>> 0 === parseFloat(n);
	}		

	apply_modifier_edit() {

		
		let t1 = this.job_base_o_table;
		let t2 = this.job_base_u_table;
		let t3 = this.job_base_p_table;
		
		for (let i in t1.rows) {
			if (i > 0) {
				let row1 = t1.rows[i];
				let row2 = t2.rows[i];
				let row3 = t3.rows[i];

				for (let j in row1.cells) {
					if (j > 0) {
						let cell1 = row1.cells[j];
						let val1 = cell1.children[0].value;
						this.om.jobs_list[i-1].job_output_vector[j-1] = parseFloat(val1);
						let cell2 = row2.cells[j];
						let val2 = cell2.children[0].value;
						this.om.jobs_list[i-1].job_upkeep_vector[j-1] = parseFloat(val2);
						let cell3 = row3.cells[j];
						let val3 = cell3.children[0].value;
						this.om.jobs_list[i-1].pop_upkeep_vector[j-1] = parseFloat(val3);
					
						}
					}  
				
				}
			
			}
			let t = this.stratum_mod_table;
			
			for (let i in [...Array(t.rows.length).keys()]) {
				
				let perc_boost_cell = t.rows[i].cells[2];
				let perc_boost_val = perc_boost_cell.children[0].value;
				this.om.stratum_output_modifiers[i].perc_boost = parseFloat(perc_boost_val);
				
			}
			t = this.job_specific_output_mod_table;
			for (let i in [...Array(t.rows.length).keys()]) {
				let perc_boost_cell = t.rows[i].cells[2];
				let perc_boost_val = perc_boost_cell.children[0].value;
				this.om.job_specific_output_modifiers[i].perc_boost = parseFloat(perc_boost_val);}
			t = this.job_specific_upkeep_mod_table;
			for (let i in [...Array(t.rows.length).keys()]) {
				let perc_boost_cell = t.rows[i].cells[2];
				let perc_boost_val = perc_boost_cell.children[0].value;
				this.om.job_specific_upkeep_modifiers[i].perc_boost = parseFloat(perc_boost_val);}
			t = this.pop_upkeep_mod_table;
			for (let i in [...Array(t.rows.length).keys()]) {
				let perc_boost_cell = t.rows[i].cells[2];
				let perc_boost_val = perc_boost_cell.children[0].value;
				this.om.pop_upkeep_modifiers[i].perc_boost = parseFloat(perc_boost_val);}

			this.om.reset_job_vectors(); // resets the resultant jobs matrix to the base values.
			this.om.apply_modifiers(); // adds modifiers back onto these base values.
			//remove the editing base editting tables, the modifier input tables, the button to apply modifier edit
			this.hide_job_base_oup_table();
			// add the edit buttons back, remove the apply button.
			this.edit_button = document.createElement("button");
			this.edit_button.innerHTML = "Directly Edit Jobs";
			this.edit_button.setAttribute("id", "edit_jm_button");
			this.edit_button.addEventListener("click", this.boundEdit);
			this.edit_by_modifiers_button = document.createElement("button");
			this.edit_by_modifiers_button.innerHTML = "Edit Jobs by Modifiers";
			this.edit_by_modifiers_button.setAttribute("id", "edit_by_modifiers_button");
			this.edit_by_modifiers_button.addEventListener("click", this.boundModifierEdit);
			document.body.insertBefore(this.edit_button, this.apply_modifiers_button);
			document.body.insertBefore(this.edit_by_modifiers_button, this.apply_modifiers_button);
			this.apply_modifiers_button.remove();
			//remove the old jobs table, add back in a new one.
			this.jobs_table.remove();
			this.set_jobs_table();
			}
	}

let pm = new page_model();

document.getElementById("calculate_button").addEventListener("click", pm.boundCalculate);
document.getElementById("edit_jm_button").addEventListener("click", pm.boundEdit);
document.getElementById("calculation_mode_button").addEventListener("click", pm.boundSwapMode);
document.getElementById("edit_by_modifiers_button").addEventListener("click", pm.boundModifierEdit);