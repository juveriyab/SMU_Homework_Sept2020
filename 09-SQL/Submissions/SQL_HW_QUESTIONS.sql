-- Question 1
select
	e.emp_no,
	e.last_name,
	e.first_name,
	e.sex,
	s.salary
from
	employees e
join salaries s on e.emp_no = s.emp_no
Order by
	e.emp_no asc


-- Question 2
select
	emp_no,
	last_name,
	first_name,
	hire_date
from
	employees
where 
	extract (year from hire_date) = 1986
order by 
	hire_date asc


-- Question 3
select
	d.dept_no,
	d.dept_name,
	e.emp_no,
	e.last_name,
	e.first_name
from
	dept_managers dm
	join departments d on dm.dept_no = d.dept_no
	join employees e on dm.emp_no = e.emp_no
order by 
	dept_no asc, e.last_name asc


-- Question 4
select
	e.emp_no,
	e.last_name,
	e.first_name,
	d.dept_name
from
	dept_emp de
	join employees e on de.emp_no = e.emp_no
	join departments d on de.dept_no = d.dept_no
order by
	e.emp_no asc


-- Question 5
select
	e.emp_no,
	e.last_name,
	e.first_name,
	e.sex
from
	employees e
where
	e.last_name like 'B%'
	and e.first_name = 'Hercules'
order by
	e.last_name asc
	

-- Question 6
select
	e.emp_no,
	e.last_name,
	e.first_name,
	d.dept_name
from
	dept_emp de
	join employees e on de.emp_no = e.emp_no
	join departments d on de.dept_no = d.dept_no
where
	d.dept_name = 'Sales'
order by
	e.emp_no asc


-- Question 7
select
	e.emp_no,
	e.last_name,
	e.first_name,
	d.dept_name
from
	dept_emp de
	join employees e on de.emp_no = e.emp_no
	join departments d on de.dept_no = d.dept_no
where
	(d.dept_name = 'Sales')
	or (d.dept_name = 'Development')
order by
	d.dept_name,
	e.last_name asc


-- Question 8
select
	last_name,
	count(*) as name_counts
from
	employees 
group by
	last_name
order by
	name_counts desc
