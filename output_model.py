# -*- coding: utf-8 -*-
"""
Created on Mon Dec 13 00:14:28 2021

@author: Bash
"""

import numpy as np
import matplotlib.pyplot as plt

class output_model:
    
    def __init__(self):
        self.jobs = [] # a list of job objects which contains information about base upkeep, base output and population upkeep
        self.targets = [] # a list of target resources and their amount.
        
        self.general_modifiers  = [] # modifiers that are applied to all jobs.
        self.stratum_modifiers  = [] # modifiers that only apply to a given stratum.
        self.specific_modifiers = [] # modifiers which are applied to a specific job.
        
        self.upkeep_reductions = [] # upkeep reductions also cannot be forgotten...
        
    def add_job(self, job):
        self.jobs.append(job)
    
    def add_default_jobs(self):
        
        worker_upkeeps = [['food', 1.0],['cg', 0.25]]
        specialist_upkeeps = [['food', 1.0],['cg', 0.5]]
        farmer  = job('farmer', [['food', 8]], [[]], 'worker' , worker_upkeeps)
        miner   = job('miner', [['minerals', 6]], [[]], 'worker' , worker_upkeeps)
        artisan = job('artisan', [['cg',8]], [['minerals', 6]], 'specialist', specialist_upkeeps)
        researcher = job('researcher', [['science', 12]],[['cg', 2]], 'specialist', specialist_upkeeps)
        metallurgist = job('metallurgist', [['alloys', 5]], [['minerals', 6]], 'specialist', specialist_upkeeps)
        
        
        self.add_job(miner)
        self.add_job(farmer)
        self.add_job(artisan)
        self.add_job(researcher)
        self.add_job(metallurgist)
        
    def add_target(self, resource, amount): # add a target amount of resource to produce
        self.targets.append([resource, amount])
    
    def add_balance_target(self): # go through the current jobs and add a target net output of 0 for the job upkeeps.
        for job in self.jobs:
            for job_output in job.job_outputs:
                if job_output:
                    self.add_target(job_output[0], 0)
            for job_upkeep in job.job_upkeeps:
                if job_upkeep:
                    self.add_target(job_upkeep[0], 0)
            for population_upkeep in job.population_upkeeps:
                if population_upkeep:
                    self.add_target(population_upkeep[0],0)
    
    def attain_target(self): # work out how many pops of each job in the model are needed in order to attain the current targets
        
        #go through targets and make a unique list of resource names, this will be the resource order for the output vector in this calculation
        resource_order = []
        for targ in self.targets:
            if targ[0] not in resource_order:
                resource_order.append(targ[0])
        #define the target vector
        target_vector = np.zeros(len(resource_order))
        for targ in self.targets:
            target_vector[resource_order.index(targ[0])] += targ[1]
        
        # create the jobs matrix which must be inverted to solve for the number of pops needed for each job.

        N = len(target_vector)
        jobs_output_matrix = np.zeros((N, N))
        jobs_upkeep_matrix = np.zeros((N, N))
        pops_upkeep_matrix = np.zeros((N, N))
        
        for i in range(N):
            job = self.jobs[i]
            #first add the job outputs to the matrix
            for output in job.job_outputs:
                if output:
                    jobs_output_matrix[i][resource_order.index(output[0])] += output[1]
            #then add the job inputs to the matrix
            for upkeep in job.job_upkeeps:
                if upkeep:
                    jobs_upkeep_matrix[i][resource_order.index(upkeep[0])] += upkeep[1]
            #then 
            for upkeep in job.population_upkeeps:
                if upkeep:
                    pops_upkeep_matrix[i][resource_order.index(upkeep[0])] += upkeep[1]
        
        J_matrix = (jobs_output_matrix - jobs_upkeep_matrix - pops_upkeep_matrix).T
        
        jobs_vector = np.around(np.linalg.solve(J_matrix, target_vector), decimals = 1)
        
        return [[self.jobs[i].job_name, jobs_vector[i]] for i in range(len(jobs_vector))]
        
class job:
    
    def __init__(self, job_name, job_outputs, job_upkeeps, stratum, population_upkeeps = [['food', 1.0],['cg', 0.5]]):
        self.job_name = job_name
        self.job_outputs = job_outputs # a list of job outputs formatted as ['resource' , output]
        self.job_upkeeps = job_upkeeps # a list of job inputs formatted as ['resource' , input]
        self.population_upkeeps = population_upkeeps
        self.stratum = stratum
        
    def __str__(self):
        return self.job_name
    
if __name__ == '__main__':
    
    #worker_upkeeps = [['food', 1.0],['cg', 0.25]]
    #farmer  = job('farmer', [['food', 6]], [[]], worker_upkeeps)
    #miner   = job('miner', [['minerals', 4]], [[]], worker_upkeeps)
    #artisan = job('artisan', [['cg',6]], [['minerals', 6]])
    #researcher = job('researcher', [['science', 12]],[['cg', 2]])
    
    cg_model = output_model()
    #cg_model.add_job(miner)
    #cg_model.add_job(farmer)
    #cg_model.add_job(artisan)
    #cg_model.add_job(researcher)
    cg_model.add_default_jobs()
    
    cg_model.add_target('science', 12 * 30)
    cg_model.add_target('alloys', 3 * 30)
#    cg_model.add_target('cg', 12)
#   cg_model.add_target('food', 12)
    cg_model.add_balance_target()
    jobs_needed = cg_model.attain_target()
    print(jobs_needed)