function setup_simulator(){

	var simulator_data = getSessionStorage('simulator_data')

	if(simulator_data === undefined){

		simulator_data = {
			n_teams: 32,
			n_suborgs: 4,
			n_alerts_per_team: 100
		}

		setSessionStorage('simulator_data', simulator_data)
	}

	console.log(simulator_data)

	var div_nteams = d3.select('div.simulator_ui').append('div')
		.style('width', '100%')

	div_nteams.append('div').text('# of teams')
		.style('text-align', 'right')
		.style('width', '70%')
		.style('display', 'inline-block')
	
	div_nteams.append('input')
		.attr('id', 'n_teams')
		.attr('type', 'text')
		.style('height', '16px')
		.style('width', '15%')
		.style('margin', '4px')
		.style('border', '1px dashed rgb(244,244,244)')
		.style('display', 'inline-block')
		.style('text-align', 'center')
		.property('value', simulator_data.n_teams)
		.on('keyup', set_simulator_data)
		
	var div_nsuborgs = d3.select('div.simulator_ui').append('div')

	div_nsuborgs.append('div').text('# of suborgs')
		.style('text-align', 'right')
		.style('width', '70%')
		.style('display', 'inline-block')

	
	div_nsuborgs.append('input')
		.attr('id', 'n_suborgs')
		.attr('type', 'text')
		.style('height', '16px')
		.style('width', '15%')
		.style('margin', '4px')
		.style('border', '1px dashed rgb(244,244,244)')
		.style('display', 'inline-block')
		.style('text-align', 'center')
		.property('value', simulator_data.n_suborgs)
		.on('keyup', set_simulator_data)
		
	var div_nalerts_per_team = d3.select('div.simulator_ui').append('div')

	div_nsuborgs.append('div').text('# of alerts per team')
		.style('text-align', 'right')
		.style('width', '70%')
		.style('display', 'inline-block')

	div_nsuborgs.append('input')
		.attr('id', 'n_alerts_per_team')
		.attr('type', 'text')
		//.style('height', '16px')
		.style('width', '15%')
		.style('margin', '4px')
		.style('border', '1px dashed rgb(244,244,244)')
		.style('display', 'inline-block')
		.style('text-align', 'center')
		.property('value', simulator_data.n_alerts_per_team)
		.on('keyup', set_simulator_data)

	// append reset button
	var div_reset_button = d3.select('div.simulator_ui').append('div')
		.attr('class', 'sim_button')
		.html('defaults')
		.on('click', function(){

			simulator_data = {
				n_teams: 32,
				n_suborgs: 4,
				n_alerts_per_team: 100
			}

			setSessionStorage('simulator_data', simulator_data)
			document.location.reload(true)

		})

	// random button
	// append reset button
	var div_random_button = d3.select('div.simulator_ui').append('div')
		.attr('class', 'sim_button')
		.html('random')
		.on('click', function(){

			simulator_data = {
				n_teams: Math.floor(Math.random()*64) + 1,
				n_suborgs: Math.floor(Math.random()*10) + 1,
				n_alerts_per_team: Math.floor(Math.random()*100)
			}

			setSessionStorage('simulator_data', simulator_data)
			document.location.reload(true)

		})

	// random big button
	var div_randombig_button = d3.select('div.simulator_ui').append('div')
		.attr('class', 'sim_button')
		.html('random (big)')
		.on('click', function(){

			simulator_data = {
				n_teams: Math.floor(Math.random()*512) + 256,
				n_suborgs: Math.floor(Math.random()*32) + 8,
				n_alerts_per_team: Math.floor(Math.random()*512)
			}

			setSessionStorage('simulator_data', simulator_data)
			document.location.reload(true)

		})

	var div_randomsmall_button = d3.select('div.simulator_ui').append('div')
		.attr('class', 'sim_button')
		.html('random (small)')
		.on('click', function(){

			simulator_data = {
				n_teams: Math.floor(Math.random()*12) + 1,
				n_suborgs: Math.floor(Math.random()*2) + 1,
				n_alerts_per_team: Math.floor(Math.random()*64)
			}

			setSessionStorage('simulator_data', simulator_data)
			document.location.reload(true)

		})

	// set data
	function set_simulator_data(){

		var temp_nteams = parseInt(d3.select('input#n_teams').property('value'))
		var temp_nsuborgs = parseInt(d3.select('input#n_suborgs').property('value'))
		var temp_nalerts_per_team = parseInt(d3.select('input#n_alerts_per_team').property('value'))

		if(_.isNumber(temp_nteams) && _.isNumber(temp_nsuborgs) && !_.isNaN(temp_nteams) && !_.isNaN(temp_nsuborgs) && !_.isNaN(temp_nalerts_per_team)){
			console.log('yep')
		} else {
			console.log('nope.')

			if(_.isNaN(temp_nteams)){
				temp_nteams = 0
			}
			if(_.isNaN(temp_nsuborgs)){
				temp_nsuborgs = 0
			}
			if(_.isNaN(temp_nalerts_per_team)){
				temp_nalerts_per_team = 0
			}

		}

		console.log(temp_nteams, temp_nsuborgs, temp_nalerts_per_team)

		var simulator_data = getSessionStorage('simulator_data')

		simulator_data.n_teams = temp_nteams
		simulator_data.n_suborgs = temp_nsuborgs
		simulator_data.n_alerts_per_team = temp_nalerts_per_team

		d3.select('input#n_teams').property('value', temp_nteams)
		d3.select('input#n_suborgs').property('value', temp_nsuborgs)
		d3.select('input#n_alerts_per_team').property('value', temp_nalerts_per_team)

		setSessionStorage('simulator_data', simulator_data)

	}

	sim_api()

}

var sim_api = function(){

	// read data from sessionStorage
	// create API results object in window namespace


  var regions = [ 'global', 'us_west_1', 'us_west_2', 'us_east_1', 'sa_east_1', 'eu_west_1', 'ap_northeast_1', 'ap_southeast_1', 'ap_southeast_2' ]
  var services = [ 'GLO', 'IAM', 'EC2', 'CLT', 'SSS', 'ELB', 'VPC', 'R53', 'DDB', 'RDS', 'RSH', 'ECH', 'CLF', 'WKS' ]
  var severities = [ 'medium', 'high', 'low' ]

  // [ team, team, team ]
  var teams = []

/*
  // team
  {

    name: string,
    report_id: int,
    stats: {
      total: int,
      regions: {
        ap_northeast_1: {
          total: int,
          pass: int,
          high: int,
          medium: int,
          low: int
        },
        ...
      },
      signatures: {
        AWS:VPC-001: int,
        ...
      }
      services: {
        EC2: int,
        ...
      }
      severities: {
        pass: int,
        low: int,
        medium: int,
        high: int
      }
    }

  }
*/

  var simulator_data = getSessionStorage('simulator_data')

  var n_teams = simulator_data.n_teams
  var n_suborgs = simulator_data.n_suborgs
  var n_alerts = simulator_data.n_alerts_per_team

  for(var i = 0; i < n_teams; i++){

    var number_of_alerts = (Math.random() * n_alerts) + 1

    if (Math.random() < 0.1) {
      number_of_alerts = n_alerts * 5 - (Math.random()*(n_alerts))
    }

    teams.push(create_team({ idx: i+1, number_of_alerts: number_of_alerts }))
  }

  var return_data = {}
  return_data.enterprise = true
  return_data.teams = teams

  function create_team(options){

    /*

      options.idx
      options.number_of_alerts

    */

    var team = {}

    team.name = 'team ' + options.idx
    team.report_id = Math.floor(Math.random()*1000 + 1)
    team.sub_organization = 'sub organization ' + Math.floor(Math.random()*n_suborgs)
    team.created_at = new moment().toISOString()

    team.stats = {

      regions: {
          ap_northeast_1: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          ap_southeast_1: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          ap_southeast_2: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          eu_west_1: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          sa_east_1: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          us_east_1: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          us_west_1: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          us_west_2: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          global: {
            total: 0,
            pass: 0,
            high: 0,
            medium: 0,
            low: 0
          }
      },
      signatures: {},
      services: {},
      severities: {
        pass: 0,
        medium: 0,
        high: 0,
        low: 0
      }

    }

    var alerts = []
    for(var i = 0; i < options.number_of_alerts; i++){
      alerts.push(create_alert())
    }

    alerts.forEach(function(alert){

      if (alert.status === 'pass') {
        team.stats.severities.pass += 1
        team.stats.regions[alert.region].pass += 1
      } else {
        team.stats.severities[alert.severity] += 1
        team.stats.regions[alert.region][alert.severity] += 1
      }

      if (team.stats.signatures[alert.signature] === undefined) {
        team.stats.signatures[alert.signature] = 1
      } else {
        team.stats.signatures[alert.signature] += 1
      }

      if (team.stats.services[alert.service] === undefined) {
        team.stats.services[alert.service] = 1
      } else {
        team.stats.services[alert.service] += 1
      }


    })

    var services_array = []

    _.each(_.keys(team.stats.services), function(service_name){
      services_array.push({
        service: service_name,
        total: team.stats.services[service_name]
      })
    })

    team.stats.services = services_array

    var severities_array = []

    _.each(_.keys(team.stats.severities), function(severity_name){

      severities_array.push({
        severity: severity_name,
        total: team.stats.severities[severity_name]
      })

    })

    team.stats.severities = severities_array

    var regions_array = []

    _.each(_.keys(team.stats.regions), function(region_name, region_index){

      var r = team.stats.regions[region_name]

      regions_array.push({
        region_id: region_index,
        name: region_name,
        code: region_name,
        total: r.high + r.medium + r.low,
        high: r.high,
        medium: r.medium,
        low: r.low,
        pass: r.pass
      })

    })

    team.stats.regions = regions_array

    var signatures_array = []

    _.each(_.keys(team.stats.signatures), function(sig_id){

      signatures_array.push({
        signature_id: Math.floor(Math.random()*25),
        unique_id: sig_id,
        total: team.stats.signatures[sig_id]
      })

    })

    team.stats.signatures = signatures_array

    ///////////////////////////////////////////////
    //=============================================
    function create_alert(){

      var alert = {}

      alert.severity = severities[Math.floor(Math.random()*severities.length)]

      if (Math.random(1.0) < 0.5) {
        alert.status = 'pass'
      } else {
        alert.status = 'fail'
      }

      alert.service = services[Math.floor(Math.random()*services.length)]

      alert.signature = 'AWS:' + alert.service + '-00' + Math.floor(Math.random()*10)

      alert.region = regions[Math.floor(Math.random()*regions.length)]

      return alert

    }

    return team

  }

  window.evident_data = return_data

}

