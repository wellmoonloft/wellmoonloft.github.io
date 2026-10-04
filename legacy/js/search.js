var inputArea = document.querySelector("#search-input")
var searchOverlayArea = document.querySelector(".search-overlay")
inputArea.onclick = function() {
  getSearchFile()
  this.onclick = null
}
inputArea.onkeydown = function() {
  if(event.keyCode == 13)
    return false
}
function openOrHideSearchContent() {
  let isHidden = searchOverlayArea.classList.contains('hidden')
  if (isHidden) {
    searchOverlayArea.classList.remove('hidden')
    document.body.classList.add('hidden')
  } else {
    searchOverlayArea.classList.add('hidden')
    document.body.classList.remove('hidden')
  }
}
function blurSearchContent(e) {
  if (e.target === searchOverlayArea) {
    openOrHideSearchContent()
  }
}
document.querySelector("#search-icon").addEventListener("click", openOrHideSearchContent, false)
document.querySelector("#search-close-icon").addEventListener("click", openOrHideSearchContent, false)
searchOverlayArea.addEventListener("click", blurSearchContent, false)
var searchFunc = function (path, search_id, content_id) {
  'use strict';
  var $input = document.getElementById(search_id);
  var $resultContent = document.getElementById(content_id);
  if (document.documentElement.lang == "en") { 
    $resultContent.innerHTML = "<ul><span class='local-search-empty'>Index file is being loaded, please wait...<span></ul>";
  }else{
    $resultContent.innerHTML = "<ul><span class='local-search-empty'>首次搜索，正在载入索引文件，请稍后...<span></ul>";
  }
  $.ajax({
    url: path,
    dataType: "xml",
    success: function (xmlResponse) {
      var datas = $("entry", xmlResponse).map(function () {
        return {
          title: $("title", this).text(),
          content: $("content", this).text(),
          url: $("url", this).text()
        };
      }).get();
      $resultContent.innerHTML = "";
      $input.addEventListener('input', function () {
        var str = '<ul class=\"search-result-list\">';
        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
        $resultContent.innerHTML = "";
        if (this.value.trim().length <= 0) {
          return;
        }
        datas.forEach(function (data) {
          var isMatch = true;
          var content_index = [];
          if (!data.title || data.title.trim() === '') {
            data.title = "Untitled";
          }
          var orig_data_title = data.title.trim();
          var data_title = orig_data_title.toLowerCase();
          var orig_data_content = data.content.trim().replace(/<[^>]+>/g, "");
          var data_content = orig_data_content.toLowerCase();
          var data_url = data.url;
          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);

              if (index_title < 0 && index_content < 0) {
                isMatch = false;
              } else {
                if (index_content < 0) {
                  index_content = 0;
                }
                if (i == 0) {
                  first_occur = index_content;
                }
              }
            });
          } else {
            isMatch = false;
          }
          if (isMatch) {
            var xx = data_url.slice(0,1);
            if(xx != "/"){
              data_url = "/" + data_url;
            }
            str += "<li><a href='" + "https://www.igerm.ee" + data_url + "' class='search-result-title'>" + orig_data_title + "</a>";
            var content = orig_data_content;
            if (first_occur >= 0) {
              var start = first_occur - 20;
              var end = first_occur + 80;
              if (start < 0) {
                start = 0;
              }
              if (start == 0) {
                end = 100;
              }
              if (end > content.length) {
                end = content.length;
              }
              var match_content = content.substr(start, end);
              keywords.forEach(function (keyword) {
                var regS = new RegExp(keyword, "gi");
                match_content = match_content.replace(regS, "<span class=\"search-keyword\">" + keyword + "</span>");
              });
              str += "<p class=\"search-result-abstract\">" + match_content + "...</p>"
            }
            str += "</li>";
          }
        });
        str += "</ul>";
        if (str.indexOf('<li>') === -1) {
          if (document.documentElement.lang == "en") { 
            return $resultContent.innerHTML = "<ul><span class='local-search-empty'>Content was not found, please try to change the search term.<span></ul>";
          }else{
            return $resultContent.innerHTML = "<ul><span class='local-search-empty'>没有找到内容，请尝试更换检索词。<span></ul>";
          }          
        }
        $resultContent.innerHTML = str;
      });
    },
    error: function(xhr, status, error) {
      $resultContent.innerHTML = ""
      if (xhr.status === 404) {
        $resultContent.innerHTML = "<ul><span class='local-search-empty'>未找到search.xml文件，具体请参考：<a href='https://github.com/zchengsite/hexo-theme-oranges#configuration' target='_black'>configuration</a><span></ul>";
      } else {
        $resultContent.innerHTML = "<ul><span class='local-search-empty'>请求失败，尝试重新刷新页面或稍后重试。<span></ul>";
      }
    }
  });
  $(document).on('click', '#search-close-icon', function() {
    $('#search-input').val('');
    $('#search-result').html('');
  });
}
var getSearchFile = function() {
  var path = "";
  if (document.documentElement.lang == "en") { 
    path = "/en/search.xml";
  }else{
    path = "/search.xml";
  }
  searchFunc(path, 'search-input', 'search-result');
}