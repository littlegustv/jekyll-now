---
layout: post
title: DEVBLOG - (chrome web store fun!)
tags: development programming game-design
draft: true
---

![Image here]({{ site.baseurl }}/images/chrome_tile_3.png "Marquee?")

Here are some thoughts as I continue to try various ways of publishing my <a href="{{ site.baseurl }}/games/platforms" class="btn btn-primary">game</a>  Right now I am working on a Chrome Web Store version, which basically means writing a manifest, creating some **new** thumbnails and promo pictures (with the appropriate - and unique - aspect ratios of course).  And also, dealing with Google's unique api for the things I had programmed a long time ago and forgotten about.

Fortunately Chrome is an up-to-date browser.  That's the advantage of JavaScript development in general, I think.  I have yet to try any kind of mobile export (like with PhoneGap - is that still around?), but the fact that its all based on webkit is just lovely.  But Chrome doesn't want me to use localStorage, it wants me to use *chrome* storage, which led me to an interesting (frustrating) problem.

localStorage uses a simple 'get' function to retrieve stored information by the given key

    var playerData = localStorage.get('playerData');  // simple as that!

chrome does it differently, however

    chrome.storage.local.get('playerData', function (result) {
      console.log('what do I do now?');
      var playerData = result.playerData;
    });

The problem is, I was happily relying on all this happening sequentially, so I would load my saved playerData, then create the main menu and show the player progress.  Now, however, since Google decided to get all cute with callback functions, I couldn't rely on this anymore.  Here's my solution:

    ...
    this.loadPlayerData();      // loads player data from chrome local storage
    var t = this;
      var s = setInterval(function () {
        if (t.ready) {
          t.readyNow();
          window.clearInterval(s);
        }
    }, 100);
    ...

    loadPlayerData: function () {
      ...
      var t = this;
      chrome.storage.local.get('playerData', function (result) {
        t.playerData = result.playerData;
        t.ready = true;
      })
    }

A lot of this is probably the result of not wanting to go back and refactor things so they actually make coherent sense, and I believe that the latest version of JavaScript lets me avoid the 'var t = this' workaround, but this is my solution to Chrome's callback insistence.  I thought you'd like to know.