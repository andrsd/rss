var express = require('express');
var http = require('http');
var url = require('url');
var htmlparser = require("htmlparser");

var router = express.Router();

var s_month = [
  '',           // empty 0th element, we will index into this using 1-based index
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

var s_day = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

function get_html(aurl, callback) {
  var handler = new htmlparser.DefaultHandler(function (error) { });
  var parser = new htmlparser.Parser(handler);
  var parsed_url = url.parse(aurl);
  var req = http.request(parsed_url, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      parser.parseChunk(chunk);
    });

    res.on('end', function () {
      parser.done();
      callback(handler.dom);
    });
  });

  req.end();
}

function get_elements_by_tag_name(html, tag_name, callback) {
  for (el in html) {
    if ((html[el].type == 'tag') && (html[el].name == tag_name))
      callback(html[el]);
    if (html[el].children)
      get_elements_by_tag_name(html[el].children, tag_name, callback);
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/garfield', function(req, res, next) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var wday = now.getDay();

  var zday = day;
  if (day < 10)
    zday = '0' + day;
  var zmonth = month;
  if (month < 10)
    zmonth = '0' + month;

  link = 'https://s3.amazonaws.com/static.garfield.com/comics/garfield/' + year + '/' + year + '-' + zmonth + '-' + zday + '.gif';

  res.setHeader('content-type', 'application/atom+xml');
  res.render('rss-single', {
    // feed info
    feed_title: 'Garfield',
    feed_url: 'http://andrs.name/rss/garfield',
    feed_link: 'http://www.garfield.com/',
    feed_ttl: '1440',
    feed_description: 'Unofficial Garfield RSS feed',
    // item info
    title: 'Comics for ' + day + ' ' + s_month[month] + ' ' + year,
    link: link,
    content: '<img src=\'' + link + '\' border=\'0\' />',
    date: s_day[wday] + ', ' + zday + ' ' + s_month[month] + ' ' + year + ' 00:00:00 -0900',
    guid: 'andrs.name-garfield:' + year + '.' + month + '.' + day
  });
});

router.get('/calvin-and-hobbes', function(req, res, next) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var wday = now.getDay();

  var zday = day;
  if (day < 10)
    zday = '0' + day;
  var zmonth = month;
  if (month < 10)
    zmonth = '0' + month;

  // get the HTML and extract the link
  get_html('http://www.gocomics.com/calvinandhobbes/' + year + '/' + zmonth + '/' + zday, function(html) {
    get_elements_by_tag_name(html, 'meta', function(node) {
      if ((node.attribs) && (node.attribs['name'] == 'twitter:image')) {
        var link = node.attribs['content'];

        res.setHeader('content-type', 'application/atom+xml');
        res.render('rss-single', {
          // feed info
          feed_title: 'Calvin and Hobbes',
          feed_url: 'http://andrs.name/rss/calvin-and-hobbes',
          feed_link: 'http://www.gocomics.com/calvinandhobbes/',
          feed_ttl: '1440',
          feed_description: 'Unofficial Calvin and Hobbes RSS feed',
          // item info
          title: 'Comics for ' + day + ' ' + s_month[month] + ' ' + year,
          link: link,
          content: '<img src=\'' + link + '\' border=\'0\' />',
          date: s_day[wday] + ', ' + zday + ' ' + s_month[month] + ' ' + year + ' 00:00:00 -0900',
          guid: 'andrs.name-calvin-and-hobbes:' + year + '.' + month + '.' + day
        });
      }
    });
  });
});

router.get('/dilbert', function(req, res, next) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var wday = now.getDay();

  var zday = day;
  if (day < 10)
    zday = '0' + day;
  var zmonth = month;
  if (month < 10)
    zmonth = '0' + month;

  get_html('http://dilbert.com/strip/' + year + '-' + zmonth + '-' + zday, function(html) {
    get_elements_by_tag_name(html, 'img', function(node) {
      if ((node.attribs) && (node.attribs['class'] == 'img-responsive img-comic')) {
        var link = node.attribs['src'];

        res.setHeader('content-type', 'application/atom+xml');
        res.render('rss-single', {
          // feed info
          feed_title: 'Dilbert',
          feed_url: 'http://andrs.name/rss/dilbert',
          feed_link: 'http://www.dilbert.com/',
          feed_ttl: '1440',
          feed_description: 'Unofficial Dilbert RSS feed',
          // item info
          title: 'Comics for ' + day + ' ' + s_month[month] + ' ' + year,
          link: link,
          content: '<img src=\'' + link + '\' border=\'0\' />',
          date: s_day[wday] + ', ' + zday + ' ' + s_month[month] + ' ' + year + ' 00:00:00 -0900',
          guid: 'andrs.name-dilbert:' + year + '.' + month + '.' + day
        });
      }
    });
  });
});

router.get('/fredo-and-pidjin', function(req, res, next) {
  var title = "";
  var descr = "";

  get_html('http://www.pidjin.net/', function(html) {
    get_elements_by_tag_name(html, 'div', function(node) {
      if ((node.attribs) && (node.attribs['class'] == 'episode_pod centered latest')) {
        for (i in node.children) {
          var ch = node.children[i];
          if ((ch.type == 'tag') && (ch.name == 'a')) {
            var link = ch.attribs['href'];

            var match = link.match(/www\.pidjin\.net\/(\d+)\/(\d+)\/(\d+)\//);
            var date = new Date(match[1], match[2] - 1, match[3], 0, 0, 0, 0);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var wday = date.getDay();

            get_html(link, function(fphtml) {
              get_elements_by_tag_name(fphtml, 'div', function(fpnode) {
                if ((fpnode.attribs) && (fpnode.attribs['class'] == 'episode')) {
                  for (j in fpnode.children) {
                    var jnd = fpnode.children[j];
                    if (jnd.type == 'tag') {
                      if (jnd.name == 'h1') {
                        title = jnd.children[0].data;
                      }
                      else if (jnd.name == 'p') {
                        var chjnd = jnd.children[0];
                        if (chjnd.name == 'img')
                          descr += '<' + chjnd.data + '><br/>';
                      }
                    }
                  }

                  res.setHeader('content-type', 'application/atom+xml');
                  res.render('rss-single', {
                    // feed info
                    feed_title: 'Fredo and Pidjin',
                    feed_url: 'http://andrs.name/rss/fredo-and-pidjin',
                    feed_link: 'http://www.pidjin.net/',
                    feed_ttl: '1440',
                    feed_description: 'Unofficial Fredo and Pidjin RSS feed',
                    // item info
                    title: title,
                    link: link,
                    content: descr,
                    date: s_day[wday] + ', ' + day + ' ' + s_month[month] + ' ' + year + ' 00:00:00 -0900',
                    guid: 'andrs.name-fredo-and-pidjin:' + year + '.' + month + '.' + day
                  });
                }
              });
            });
          }
        }
      }
    });
  });
});

module.exports = router;
