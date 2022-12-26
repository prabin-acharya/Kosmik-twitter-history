# Kosmik
  Social Medias has become an integral part of modern society. Important decisions are announced through social media, debates and discussions are held here, ideas are criticized. Despite having many negeative consequesnces, it has become an important aspect of modern world. But, all of them are focused on \*now\*. It is clearly evident by Twitter's tagline "What's Happening?".  This constant pull towards getting up to date with the world events induces fear of missing out among users and are the reason why we can't stay a day without checking the Internet. This is one of the reason many consider Social Media as toxic. 
  On the other hand, a lot of the valuable information on the conversations, discussions are lost. We can learn a lot from the past conversations and discussions held if we can filter and surface them properly.
 
This constant focus toward now is not just evident on Social Medias. It is also clearly evident on discussion forums(Discord, Slack,etc.) which is really a problem because problem you are having is probably faced by someone else before. And, this the problem of engaging in same discussion again and again is faced by forums managers. And, these tools nowadays only offers hack to find content from the past.

Relaizing this, I am thinking about social media which do not constantly pull you toward the current trends. 

## How it Works?
   Kosmik is an attempt to see what such social media looks like. Kosmik is built on top of Twitter API. You can simply login with your Twitter Account and browse the past.

## Features
- can go to a particular time/period
- create list, add people to existing list
- like, bookmark tweet directly from app
  
## Challenges I ran into
- Building on top of Twitter API is really hard and particularly for an app like this where we need to fetch past tweets. Twitter API search endpoint limits tweets you can fetch to only last 7 days. I got around this with Twitter API search user timeline endpoint which also limits the tweet you can fetch to just last 3200(which is just last year of tweets if you tweet 8 per day). This makes it really hard to build an app like Kosmik. I overcame this problem by fetching from multiple related accounts(lists). And allowing people to easily create lists.
- I always find it hard to implement authentication. This was no exception. Implementing Oauth 2.0 was hard.
  
## What did I learn?
- On the technical side, I learned a lot about Oauth2.0 authentication and authorization. I always find it difficult to implement authentication. I learned a lot while implementing this one.
- On the overall as a project goal, I am learning a lot about how such socail media looks like. And the challenges for creating one.

If you have any ideas or are working on similar projects. Hit me up, I'd be super excited to jam. 


	  Built Using Next.js
