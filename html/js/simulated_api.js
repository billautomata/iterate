function dashboard_api(){

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

  var n_teams = 96
  var n_suborgs = 10
  var n_alerts = 50

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

  return return_data

}


function simulated_api(post_data, callback){

  var region_name_lut = [ 'global', 'us_west_1', 'us_west_2', 'us_east_1', 'sa_east_1', 'eu_west_1', 'ap_northeast_1', 'ap_southeast_1', 'ap_southeast_2' ]
  var services_name_lut = [ 'Global', 'IAM', 'EC2', 'CloudTrail', 'S3', 'ELB', 'VPC', 'R53', 'DynamoDB', 'RDS', 'Redshift', 'Elasticache', 'CloudFormation', 'Workspaces' ]

  // mapping of plaintext name to services_list
  var service_name_lut = {
      'VPC': 'VPC',
      'IAM': 'IAM',
      'Global': 'GLO',
      'EC2': 'EC2',
      'ELB': 'ELB',
      'R53': 'R53',
      'CloudTrail': 'CLT',
      'S3': 'SSS',
      'RDS': 'RDS',
      'DynamoDB': 'DDB',
      'CloudFormation': 'CLF',
      'Redshift': 'RED',
      'Elasticache': 'ELC',
      'Workspaces': 'WKS'
  }

  var severity_lut = [ 'high', 'medium', 'low' ]
  var status_lut = [ 'fail', 'pass', 'warn' ]

  console.log('simulated_api called...')

  //console.log(post_data)

/*

  // post data

  {
    fidelity: 0,
    start_date: begin_date.toISOString(),
    end_date: end_date.toISOString(),
    verbose: true
    number_of_teams: 5
    number_of_accounts_per_team: 3
    number_of_alerts_per_account: 100
  }

  future features
  number of sub organizations

*/

  var begin_date = new moment(post_data.start_date)
  var end_date = new moment(post_data.end_date)

  data_set = []

  /*

    data_set = [ report, report, report, report ]

    report = {
      date: moment()
      alerts = [ alert, alert, alert ]
    }

    alert = { serverity, region, service, account, pass }

  */

  while(begin_date <= end_date){

    if (post_data.fidelity === 0) {
      end_date = begin_date.clone().add(-100,'minutes')
      console.log(begin_date.toISOString() + ' '+ end_date.toISOString())
    }


    for(var team_idx = 0; team_idx < post_data.number_of_teams; team_idx ++){

      report = {}
      var alerts_array = []

      report.organization_name = 'org evident'
      report.sub_organization_name = 'engineering'
      report.team_name = 'team number ' + team_idx

      for(var account_idx = 0; account_idx < post_data.number_of_accounts_per_team; account_idx++){

        var number_of_alerts = post_data.number_of_alerts_per_account * Math.random()
        for(var alert_idx = 0; alert_idx < number_of_alerts; alert_idx++){

          /*
            var alert = {
                severity: severity_lut[ Math.floor( Math.random() * severity_lut.length) ],
                region: region_name_lut[ Math.floor( Math.random() * region_name_lut.length) ],
                service: services_name_lut [ Math.floor ( Math.random() * services_name_lut.length) ],
                account: ('account ' + account_idx),
                pass: true
            }
            if (Math.random() > 0.5) {
                alert.pass = false
            }
          */

            /*
              var region = alert.region.code.split('_').join('-')
              var service = alert.signature.signature_unique_id.split(':')[1].split('-')[0]
              var risk_level = alert.signature.risk_level.toLowerCase()
              var alert_on = alert.alert_on
              var alert_status = alert.status
              var account = alert.amazon_config.arn

            */

            alert = {}

            alert.region = {}
            alert.region.code = region_name_lut[ Math.floor( Math.random() * region_name_lut.length) ]

            var unique_alert_sig_id_number = Math.floor(Math.random() * 10)
            alert.signature = {}
            alert.signature.signature_unique_id = 'AWS:' + service_name_lut[services_name_lut [ Math.floor ( Math.random() * services_name_lut.length) ]] + '-00' + unique_alert_sig_id_number
            alert.signature.risk_level = severity_lut[ Math.floor( unique_alert_sig_id_number % severity_lut.length) ]

            alert.alert_on = (Math.random() < 0.9)
            alert.status = status_lut[ Math.floor( Math.random() * status_lut.length) ]

            alert.external_account = {}
            alert.external_account.nickname = ('account ' + ((team_idx * post_data.number_of_accounts_per_team) + account_idx))

            alerts_array.push(alert)

        }

      }

      report.alerts = alerts_array
      report.date = begin_date.toISOString()

      data_set.push(report)

    }

    begin_date.add(post_data.fidelity,'hours')

  }

  return { evident_report: {reports: data_set, enterprise: true } }

}