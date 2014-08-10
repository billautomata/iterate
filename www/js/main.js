
  setup_simulator()

  // 2508468d856680cf5351

  var comments_json = []
  var commits_json = []

  var host = '/api/gist_everything/'

  var gist = window.location.hash.split('#')[1]

  if(window.location.hash.split('#')[2] === 'local'){
    host = '/api/gist_local/'
  }

  d3.json(host+gist + '?'+Math.random(), function(json){

    console.log(json)

    json.files.forEach(function(file){

      var extension = file.name.split('.')[1]

      if(extension === 'js'){

        var s = document.createElement('script');
        s.type = 'text/javascript';
        var code = file.content;
        try {
          s.appendChild(document.createTextNode(code));
          document.body.appendChild(s);
        } catch (e) {
          s.text = code;
          document.body.appendChild(s);
        }

      } else if (extension === 'md'){
        d3.select('div.description').append('div')
          .attr('class', 'md')
          .html(file.content)
      } else if (extension === 'css'){
        d3.select('head').append('style').html(file.content)
      }

    })

    json.history.forEach(function(element){

      if(element.committed_at === undefined){

        // comment type
        comments_json.push(element)

      } else {

        // commit type
        commits_json.push(element)

      }

    })

    display_history()

  })

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

    console.log(history)

    history.forEach(function(element){

      console.log(element)

      //if(element.type === 'commit' && element.element.change_status.additions === undefined){ return; }

      console.log(element)

      var div = d3.select('div.comments_and_commits').append('div')
        .style('margin', 3)
        .style('border', '1px solid rgb(232,232,232)')
        .style('padding', 5)

      if(element.type === 'commit'){

        var lines_added = element.element.change_status.additions
        var lines_removed = element.element.change_status.deletions

        div.style('display', 'inline-block')
        div.append('span').html('commit ')

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