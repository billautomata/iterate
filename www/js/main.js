/* jshint undef: true, asi: true, browser: true, devel: true, node: true */
/* global d3, moment, setup_simulator, _ */

setup_simulator()

var version_info = {
  version: '0.0.0',
  title: 'sketch'
}

var custom_js_build = []

var comments_json = []
var commits_json = []

var host = '/api/gist_everything/'

var gist = window.location.hash.split('#')[1]

if(window.location.hash.split('#')[2] === 'local'){
  host = '/api/gist_local/'
}

d3.json(host+gist + '?'+Math.random(), function(json){

  mogrify_response(json)

  set_title()
  display_history()

})

function mogrify_response(json){

  var javascript_files = {}

  json.files.forEach(function(file){

    var extension = file.name.split('.')[1]

    if(extension === 'js'){
      javascript_files[file.name] = file.content

    } else if (extension === 'md'){
      d3.select('div.description').append('div')
        .attr('class', 'md')
        .html(file.content)

    } else if (extension === 'css'){
      d3.select('head').append('style').html(file.content)
    }

    if(file.name === 'version.json'){
      version_info = JSON.parse(file.content)
    }

    if(file.name === 'imports.json'){
      custom_js_build = JSON.parse(file.content)
    }

  })

  if(custom_js_build.length === 0){
    _.keys(javascript_files).forEach(function(filename){
      load_js_script(javascript_files[filename])
    })
  } else {
    custom_js_build.forEach(function(filename){

      if(_.isUndefined(javascript_files[filename])){
        console.log('hilarious... ' + filename +  ' not found.')
      } else {
        console.log('importing ' + filename)
        load_js_script(javascript_files[filename])
      }

    })
  }

  json.history.forEach(function(element){

    if(element.committed_at === undefined){
      // comment type
      comments_json.push(element)
    } else {
      // commit type
      commits_json.push(element)
    }

  })

}

function load_js_script(code){

  var s = document.createElement('script');
  s.type = 'text/javascript';
  try {
    s.appendChild(document.createTextNode(code));
    document.body.appendChild(s);
  } catch (e) {
    s.text = code;
    document.body.appendChild(s);
  }

}

function set_title(){

  if(version_info.title === 'sketch'){
    d3.select('title').text('gist #' + gist)
  } else {
    d3.select('title').text(version_info.title)
  }

}

function display_history(){

  var history = []

  comments_json.forEach(function(comment){

    history.push({
      date: comment.created_at,
      type: 'comment',
      element: comment
    })

  })

  commits_json.forEach(function(commit){

    history.push({
      date: commit.committed_at,
      type: 'commit',
      element: commit
    })

  })

  history.sort(function(a,b){
    return new moment(b.date).valueOf() - new moment(a.date).valueOf()
  })

  //console.log(history)

  history.forEach(function(element){

    //console.log(element)

    var div = d3.select('div.comments_and_commits').append('div')
      .attr('class', 'individual_comment_and_commit')

    if(element.type === 'commit'){

      var lines_added = element.element.change_status.additions
      var lines_removed = element.element.change_status.deletions

      div.style('display', 'inline-block')
      div.append('span').html('( commit ) ')

      if(lines_added !== undefined){
        div.append('span').html('(+' + lines_added).style('color', 'green')
        div.append('span').html('-' + lines_removed).style('color', 'red')
        div.append('span').html(') ' + new moment(element.date).fromNow())
      } else {
        div.append('span').html(new moment(element.date).fromNow())
      }

    } else {

      div.append('p').html(element.element.user.login).style('font-weight', 800)
      div.append('p').html(element.element.created_at).style('font-style', 'italic')
      div.append('p').html(element.element.body)

    }

  })

} // end of display_history
