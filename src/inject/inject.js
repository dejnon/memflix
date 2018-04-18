console.log('INJECT');

var actualCode = `
console.log("INJECTED CODE");
(function() {
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    console.log('request started!');
    this.addEventListener('load', function() {
      if (!this.responseURL.match(/\\/\\?o\\=/g)) return;
      console.log(this)
      var event = new MessageEvent('memflix', {data: this.responseText});
      document.dispatchEvent(event);
    });
    origOpen.apply(this, arguments);
  };
})();
`;

document.addEventListener("memflix", function(data) {
    console.log('Sending...');
    chrome.runtime.sendMessage({data: data.data});
});

var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.remove();