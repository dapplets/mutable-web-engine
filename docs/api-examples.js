temp1.provider.createApplication({
  id: 'bos.dapplets.near/app/Tipping',
  targets: [
    {
      namespace: 'bos.dapplets.near/parser/twitter',
      contextType: 'post',
      if: { id: { not: null } },
      injectTo: 'southPanel',
      injectOnce: true,
      componentId: 'bos.dapplets.near/widget/Tipping.Main',
    },
    {
      namespace: 'bos.dapplets.near/parser/near-social',
      contextType: 'post',
      if: { id: { not: null } },
      injectTo: 'southPanel',
      injectOnce: true,
      componentId: 'bos.dapplets.near/widget/Tipping.Main',
    },
  ],
  metadata: {
    name: 'Tipping',
    description:
      'Tipping dapplet allows you to donate NEAR tokens to X and GitHub users. It charges an extra fee of 3% on each donation.',
    image: {
      ipfs_cid: 'bafkreif7fkfyupdrms3zn6xiptlxmekdl5g7cfgihsq6piqrwxu7pfywfy',
    },
  },
})

temp1.provider.createApplication({
  id: 'bos.dapplets.near/app/Dog',
  targets: [
    {
      namespace: 'bos.dapplets.near/parser/twitter',
      contextType: 'post',
      if: { id: { not: null, index: true } },
      injectTo: 'root',
      componentId: 'bos.dapplets.near/widget/Dog',
    },
    {
      namespace: 'bos.dapplets.near/parser/near-social',
      contextType: 'post',
      if: { id: { not: null, index: true } },
      injectTo: 'root',
      componentId: 'bos.dapplets.near/widget/Dog',
    },
  ],
  metadata: {
    name: 'Dog',
    description: 'Just a vector image for testing purposes',
    image: {
      ipfs_cid: 'bafkreiconobvmlnm3vjjyvmcvy3sruppk2e3g7b6sxampmy6ajbm2ln54q',
    },
  },
})

temp1.provider.createApplication({
  id: 'bos.dapplets.near/app/Cat',
  targets: [
    {
      namespace: 'bos.dapplets.near/parser/twitter',
      contextType: 'post',
      if: { id: { not: null, index: true } },
      injectTo: 'root',
      componentId: 'bos.dapplets.near/widget/Cat',
    },
    {
      namespace: 'bos.dapplets.near/parser/near-social',
      contextType: 'post',
      if: { id: { not: null, index: true } },
      injectTo: 'root',
      componentId: 'bos.dapplets.near/widget/Cat',
    },
  ],
  metadata: {
    name: 'Cat',
    description: 'Just a vector image for testing purposes',
    image: {
      ipfs_cid: 'bafkreie4tum66dxhl4twu6ak3d2vgtxkwc3rkoay2rriqzdwm4m2hflgwy',
    },
  },
})

temp1.provider.createApplication({
  id: 'bos.dapplets.near/app/Paywall',
  targets: [
    {
      namespace: 'bos.dapplets.near/parser/twitter',
      contextType: 'post',
      if: { id: { not: null, index: true } },
      injectTo: 'afterText',
      componentId: 'bos.dapplets.near/widget/Paywall.Main',
    },
    {
      namespace: 'bos.dapplets.near/parser/near-social',
      contextType: 'post',
      if: { id: { not: null, index: true } },
      injectTo: 'afterText',
      componentId: 'bos.dapplets.near/widget/Paywall.Main',
    },
    {
      namespace: 'bos.dapplets.near/parser/linkedin',
      contextType: 'post',
      if: { id: { not: null, index: true } },
      injectTo: 'afterText',
      componentId: 'bos.dapplets.near/widget/Paywall.Main',
    },
  ],
  metadata: {
    name: 'Paywall',
    description:
      'The Paywall Dapplet seamlessly integrates with Twitter, utilizing the NEAR Protocol and NEAR BOS to display paid content',
    image: {
      ipfs_cid: 'bafkreif7roycllkswl2sveqpt4zbzce3e4vjasr756bdh4a2334i55upnq',
    },
  },
})

temp1.provider.createParserConfig({
  id: 'bos.dapplets.near/parser/twitter',
  parserType: 'json',
  contexts: {
    root: {
      props: {
        id: "string('global')",
        websiteName: "string('Twitter')",
        username: "substring-after(string(//header//a[@aria-label='Profile']/@href), '/')",
        fullname: "string(//*[@aria-label='Account menu']//img/@alt)",
        img: "string(//*[@aria-label='Account menu']//img/@src)",
        url: "string(//html/head/meta[@property='og:url']/@content)",
      },
      children: ['post', 'profile'],
    },
    post: {
      selector: 'div[data-testid=cellInnerDiv]',
      props: {
        id: "substring-after(string(.//time/../@href), 'status/')",
        text: "string(.//*[@data-testid='tweetText'])",
        authorFullname: "string(.//*[@data-testid='User-Name']//span)",
        authorUsername: "substring-before(substring-after(string(.//time/../@href), '/'), '/')",
        authorImg: 'string(.//img/@src)',
        createdAt: 'string(.//time/@datetime)',
        url: "concat('https://twitter.com/', substring-before(substring-after(string(.//time/../@href), '/'), '/'), '/status/', substring-after(string(.//time/../@href), 'status/'))",
      },
      insertionPoints: {
        root: {
          selector: ':scope > div',
          bosLayoutManager: 'bos.dapplets.near/widget/ContextActionsGroup',
          insertionType: 'before',
        },
        southPanel: {
          selector: 'div[role=group] > *:last-child',
          insertionType: 'after',
        },
        avatar: {
          selector: 'div.r-18kxxzh.r-1wbh5a2.r-13qz1uu > *:last-child',
          insertionType: 'after',
        },
        afterText: {
          selector: '[data-testid=tweetText]',
          bosLayoutManager: 'bos.dapplets.near/widget/VerticalLayoutManager',
          insertionType: 'end',
        },
      },
    },
    profile: {
      selector: 'div[data-testid=primaryColumn]',
      props: {
        id: "substring-after(string(.//*[@data-testid='UserName']/div/div/div[2]//span), '@')",
        authorFullname: "string(.//*[@data-testid='UserName']//span[1])",
        authorUsername:
          "substring-after(string(.//*[@data-testid='UserName']/div/div/div[2]//span), '@')",
        authorImg: "string(.//img[contains(@alt,'Opens profile photo')]/@src)",
        url: "concat('https://twitter.com/', substring-after(string(.//*[@data-testid='UserName']/div/div/div[2]//span), '@'))",
      },
      insertionPoints: {
        southPanel: {
          selector: '[data-testid=placementTracking]',
          insertionType: 'after',
        },
        avatar: {
          selector: 'div.r-1ifxtd0.r-ymttw5.r-ttdzmv div.r-ggadg3.r-u8s1d.r-8jfcpp',
          insertionType: 'begin',
        },
      },
    },
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'twitter.com' } },
    },
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'www.twitter.com' } },
    },
  ],
})

temp1.provider.createParserConfig({
  id: 'bos.dapplets.near/parser/near-social',
  parserType: 'bos',
  contexts: {
    post: {
      component: 'mob.near/widget/MainPage.N.Post',
      props: {
        id: '{{props.accountId}}/{{props.blockHeight}}',
        authorUsername: '{{props.accountId}}',
      },
      insertionPoints: {
        root: {
          bosLayoutManager: 'bos.dapplets.near/widget/ContextActionsGroup',
          insertionType: 'begin',
        },
        southPanel: {
          component: 'mob.near/widget/MainPage.N.Post.ShareButton',
          insertionType: 'after',
        },
        afterText: {
          bosLayoutManager: 'bos.dapplets.near/widget/VerticalLayoutManager',
          component: 'mob.near/widget/MainPage.N.Post.Content',
          insertionType: 'after',
        },
      },
    },
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'localhost' } },
    },
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'mutable-near-social.netlify.app' } },
    },
  ],
})

temp1.provider.createParserConfig({
  id: 'bos.dapplets.near/parser/github',
  parserType: 'json',
  contexts: {
    root: {
      props: {
        id: "string('global')",
        websiteName: "string('GitHub')",
        username:
          "normalize-space(string(//div[@class='Overlay-titleWrap']//span[@class='Truncate-text']))",
        fullname:
          "normalize-space(string(//div[@class='Overlay-titleWrap']//span[@class='Truncate-text']/../../span[2]))",
        img: "string(//div[@class='Overlay-titleWrap']//img/@src)",
        url: "string(//html/head/meta[@property='og:url']/@content)",
      },
      children: ['post', 'profile'],
    },
    post: {
      selector: '.TimelineItem.js-comment-container',
      props: {
        id: "string(.//div[contains(@class,'timeline-comment-group')]/@id)",
        authorUsername:
          "substring-after(string(.//div[contains(@class,'TimelineItem-avatar')]/a/@href | .//a[contains(@class,'TimelineItem-avatar')]/@href), '/')",
        authorImg: "string(.//*[contains(@class,'TimelineItem-avatar')]//img/@src)",
        url: "concat(string(//html/head/meta[@property='og:url']/@content),'#', string(.//div[contains(@class,'timeline-comment-group')]/@id))",
        createdAt: 'string(.//relative-time/@datetime)',
        text: "normalize-space(string(.//*[contains(@class,'js-comment-body')]))",
      },
      insertionPoints: {
        root: {
          selector: ':scope > .timeline-comment-group',
          bosLayoutManager: 'bos.dapplets.near/widget/ContextActionsGroup',
          insertionType: 'after',
        },
        beforeText: {
          selector: '.js-comment-body',
          bosLayoutManager: 'bos.dapplets.near/widget/VerticalLayoutManager',
          insertionType: 'before',
        },
        afterText: {
          selector: '.js-comment-body',
          bosLayoutManager: 'bos.dapplets.near/widget/VerticalLayoutManager',
          insertionType: 'after',
        },
        avatar: {
          selector: 'div.TimelineItem-avatar > a',
          insertionType: 'before',
        },
        southPanel: {
          selector: '.timeline-comment-actions',
          insertionType: 'after',
        },
      },
    },
    profile: {
      selector: '.js-profile-editable-replace',
      props: {
        id: "normalize-space(substring-before(substring-after(string(.//h1/span[2]), '\\n'), '\\n'))",
        authorFullname: 'normalize-space(string(.//h1/span[1]))',
        authorUsername:
          "normalize-space(substring-before(substring-after(string(.//h1/span[2]), '\\n'), '\\n'))",
        authorImg: 'string(.//img/@src)',
        url: "concat('https://github.com/', normalize-space(substring-before(substring-after(string(.//h1/span[2]), '\\n'), '\\n')))",
      },
      insertionPoints: {
        southPanel: { selector: 'div.clearfix', insertionType: 'end' },
        avatar: { selector: 'div.clearfix > div', insertionType: 'end' },
        fullname: {
          selector: 'h1>span:first-child',
          insertionType: 'end',
        },
      },
    },
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'github.com' } },
    },
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'www.github.com' } },
    },
  ],
})

temp1.provider.createParserConfig({
  id: 'bos.dapplets.near/parser/common',
  parserType: 'json',
  contexts: {
    root: {
      props: { id: "string('global')", websiteName: 'string(//title)' },
      children: ['body'],
    },
    body: {
      selector: '',
      props: { id: 'string(//title)' },
      insertionPoints: {
        before: { selector: 'body', insertionType: 'before' },
        end: { selector: 'body', insertionType: 'end' },
        after: { selector: 'body', insertionType: 'after' },
      },
    },
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'localhost' } },
    },
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'mutable-near-social.netlify.app' } },
    },
  ],
})

temp1.provider.createParserConfig({
  id: 'bos.dapplets.near/parser/youtube',
  parserType: 'json',
  contexts: {
    root: {
      props: {
        id: "string('global')",
        websiteName: "string('YouTube')",
        username: "string(.//*[@id='channel-handle']/@title)",
        fullname: "string(.//*[@id='account-name']/@title)",
        img: "string(.//*[@aria-label='Account menu']//img[@id='img']/@src)",
        url: "string(concat('https://www.youtube.com/', string(.//*[@id='channel-handle']/@title)))",
      },
      children: ['post', 'profile'],
    },
    post: {
      selector: '#contents>ytd-rich-item-renderer, #below',
      props: {
        id: "substring-after(string(//meta[@property='og:url']/@content | .//h3//a/@href), 'v=')",
        text: "string(.//*[@id='description-inline-expander']/yt-attributed-string/span | .//*[@id='attributed-snippet-text']/span)",
        authorFullname:
          "normalize-space(string(.//ytd-channel-name//*[@id='container']//*[@id='text-container']//yt-formatted-string[@id='text']/@title))",
        authorUsername:
          "substring(string(.//ytd-channel-name//*[@id='container']//*[@id='text-container']//yt-formatted-string[@id='text']//a/@href), 2)",
        authorImg:
          "string(.//*[@id='avatar'][contains(@class, 'style-scope ytd-video-owner-renderer no-transition')]//img/@src | .//*[@id='avatar'][contains(@class, 'style-scope ytd-rich-grid-media no-transition')]//img/@src)",
        createdAt:
          "substring-before(substring-after(string(.//*[@id='description']//*[@id='tooltip'][contains(@class, 'style-scope')]), ' • '), ' • ')",
        url: "concat('https://www.youtu.be/', substring-after(string(//meta[@property='og:url']/@content | .//h3//a/@href), 'v='))",
      },
      insertionPoints: {
        root: {
          selector: ':scope > div',
          bosLayoutManager: 'bos.dapplets.near/widget/ContextActionsGroup',
          insertionType: 'before',
        },
        southPanel: {
          selector:
            '#details.ytd-rich-grid-media, #subscribe-button.style-scope.ytd-watch-metadata',
          insertionType: 'after',
        },
        afterText: {
          selector: '#bottom-row',
          bosLayoutManager: 'bos.dapplets.near/widget/VerticalLayoutManager',
          insertionType: 'after',
        },
        avatar: {
          selector:
            '#avatar.style-scope.ytd-rich-grid-media.no-transition img, #avatar.style-scope.ytd-video-owner-renderer.no-transition img',
          insertionType: 'before',
        },
        fullname: {
          selector: 'ytd-channel-name>ytd-badge-supported-renderer',
          insertionType: 'before',
        },
        beforeText: { selector: '#bottom-row', insertionType: 'begin' },
      },
    },
    profile: {
      selector: '#channel-header',
      props: {
        id: "string(.//*[@id='channel-handle'])",
        authorUsername: "string(.//*[@id='channel-handle'])",
        authorFullname: "string(.//*[@id='channel-name']//*[@id='text'])",
        authorImg: "string(.//*[@id='avatar']//img/@src | .//*[@id='avatar-editor']//img/@src)",
      },
      insertionPoints: {
        root: { selector: '#other-buttons', insertionType: 'before' },
        PROFILE_AVATAR: {
          selector: '#avatar>img, #avatar-editor img',
          insertionType: 'before',
        },
        PROFILE_FULLNAME: {
          selector: '#channel-tagline',
          insertionType: 'begin',
        },
      },
    },
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'youtube.com' } },
    },
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'www.youtube.com' } },
    },
  ],
})

temp1.provider.createParserConfig({
  id: 'bos.dapplets.near/parser/reddit',
  parserType: 'json',
  contexts: {
    root: {
      props: {
        id: "string('global')",
        websiteName: "string('Reddit')",
        username: "string(//*[@id='email-collection-tooltip-id']/span/span[1])",
        img: "string(//*[@id='email-collection-tooltip-id']/div/img/@src)",
        url: "string(//html/head/meta[@property='og:url']/@content)",
      },
      children: ['post', 'profile'],
    },
    post: {
      selector: "[data-testid='post-container']",
      props: {
        id: "substring-after(string(./@id), '_')",
        text: "substring-before(string(.//*[@data-adclicklocation='title']//*[@data-click-id='body'] | .//*[@data-adclicklocation='title']), '\\n')",
        innerText:
          "string(.//*[@data-click-id='body']//*[@data-click-id='text'] | .//*[@data-click-id='text'])",
        innerImage:
          "string(.//*[@data-click-id='media']//img/@src | .//img[contains(@class, 'ImageBox-image media-element')]/@src)",
        innerLink: "string(.//a[@data-testid='outbound-link']/@href)",
        innerVideo:
          "string(.//*[@data-click-id='media']//*[@data-testid='shreddit-player-wrapper']//@src)",
        authorUsername: "string(.//*[@data-click-id='user'])",
        publisher:
          "substring(string(.//*[@data-click-id='subreddit']/@href), 2, string-length(string(.//*[@data-click-id='subreddit']/@href)) - 2)",
        authorImg: 'string(.//img/@src)',
        url: "concat('https://www.reddit.com', string(.//*[@data-click-id='body']/@href))",
      },
      insertionPoints: {
        root: {
          selector: ':scope > div',
          bosLayoutManager: 'bos.dapplets.near/widget/ContextActionsGroup',
          insertionType: 'before',
        },
        default: {
          selector:
            ".STit0dLageRsa2yR4te_b, [data-click-id='text'], ._1NSbknF8ucHV2abfCZw2Z1, ._10wC0aXnrUKfdJ4Ssz-o14",
          insertionType: 'before',
        },
        fullname: {
          selector: '._2mHuuvyV9doV3zwbZPtIPG',
          insertionType: 'before',
        },
        northPanel: {
          selector: '.cZPZhMe-UCZ8htPodMyJ5',
          insertionType: 'before',
        },
        afterText: {
          selector:
            ".STit0dLageRsa2yR4te_b, [data-click-id='text'], ._1NSbknF8ucHV2abfCZw2Z1, ._10wC0aXnrUKfdJ4Ssz-o14",
          bosLayoutManager: 'bos.dapplets.near/widget/VerticalLayoutManager',
          insertionType: 'after',
        },
        beforeText: {
          selector:
            ".STit0dLageRsa2yR4te_b, [data-click-id='text'], ._1NSbknF8ucHV2abfCZw2Z1, ._10wC0aXnrUKfdJ4Ssz-o14",
          insertionType: 'before',
        },
        southPanel: {
          selector: '._3MmwvEEt6fv5kQPFCVJizH',
          insertionType: 'before',
        },
      },
    },
    profile: {
      selector: '.QscnL9OySMkHhGudEvEya',
      props: {
        id: "string(.//h2 | .//*[contains(@class, 'flex items-end justify-start')]//*[contains(@class, 'font-bold text-18')])",
        authorFullname:
          "string(.//h1 | .//*[contains(@class, 'flex items-end justify-start')]//*[contains(@class, 'font-bold text-18')])",
        authorUsername:
          "string(.//h2 | .//*[contains(@class, 'flex items-end justify-start')]//*[contains(@class, 'font-bold text-18')])",
        authorImg:
          "string(.//img/@src | .//*[contains(@class, 'flex items-end justify-start')]//*[contains(@class, 'font-bold text-18')])",
      },
      insertionPoints: {
        default: {
          selector:
            "._3TG57N4WQtubLLo8SbAXVF, .flex.w-100.mt-xs>span, faceplate-tracker[source='profile'][noun='chat']",
          insertionType: 'before',
        },
        avatar: {
          selector: 'img:last-child, .shreddit-subreddit-icon__icon',
          insertionType: 'before',
        },
        fullname: {
          selector:
            "._3TG57N4WQtubLLo8SbAXVF, .flex.w-100.mt-xs>span, faceplate-tracker[source='profile'][noun='chat']",
          insertionType: 'before',
        },
      },
    },
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'reddit.com' } },
    },
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'www.reddit.com' } },
    },
  ],
})

temp1.provider.createParserConfig({
  id: 'bos.dapplets.near/parser/linkedin',
  parserType: 'json',
  contexts: {
    root: {
      props: {
        id: "string('global')",
        websiteName: "string('LinkedIn')",
        username:
          "substring(substring-before(substring-after(string(.//body/code[7]), 'publicIdentifier'), ','), 4, string-length(substring-before(substring-after(string(.//body/code[7]), 'publicIdentifier'), ',')) - 4)",
        fullname: "string(//img[contains(@class, 'global-nav__me-photo')]/@alt)",
        img: "string(//img[contains(@class, 'global-nav__me-photo')]/@src)",
        url: "string('https://www.linkedin.com')",
      },
      children: ['post', 'profile'],
    },
    post: {
      selector: '.feed-shared-update-v2',
      props: {
        id: "substring-after(string(./@data-urn), 'activity:')",
        authorUsername:
          "substring-after(substring-before(string(.//a[contains(@class, 'update-components-actor__image')]/@href), '?'), '/in/')",
        authorFullname: '.update-components-actor__name span[dir=ltr]',
        authorImg: "string(.//img[contains(@class, 'update-components-actor__avatar-image')]/@src)",
        text: "normalize-space(string(.//div[contains(@class, 'feed-shared-update-v2__description-wrapper')]//div[contains(@class, 'update-components-text')]))",
        innerImage: "string(.//div[contains(@class, 'update-components-image')]//img/@src)",
        url: "concat('https://www.linkedin.com/feed/update/', string(./@data-urn))",
      },
      insertionPoints: {
        root: {
          selector: ':scope > div',
          bosLayoutManager: 'bos.dapplets.near/widget/ContextActionsGroup',
          insertionType: 'before',
        },
        avatar: {
          selector: '.js-update-components-actor__avatar div:first-child',
          insertionType: 'end',
        },
        northPanel: {
          selector: '.update-components-actor__container',
          insertionType: 'before',
        },
        southPanel: {
          selector: '.feed-shared-social-action-bar__action-button:last-child',
          insertionType: 'before',
        },
        fullname: {
          selector: '.update-components-actor__meta>a:last-child>span>div>span',
          insertionType: 'end',
        },
        afterText: {
          selector: '.update-v2-social-activity',
          bosLayoutManager: 'bos.dapplets.near/widget/VerticalLayoutManager',
          insertionType: 'begin',
        },
        beforeText: {
          selector: '.update-components-actor',
          insertionType: 'before',
        },
      },
    },
    profile: {
      selector: 'section:first-child',
      props: {
        id: "substring-before(substring-after(string(.//div[contains(@class, 'ph5')]//a[contains(@class, 'pv-text-details__about-this-profile-entrypoint')]/@href), 'in/'), '/')",
        authorFullname: "string(.//div[contains(@class, 'ph5')]//h1)",
        authorUsername:
          "substring-before(substring-after(string(.//div[contains(@class, 'ph5')]//a[contains(@class, 'pv-text-details__about-this-profile-entrypoint')]/@href), 'in/'), '/')",
        authorImg: "string(.//div[contains(@class, 'ph5')]//img/@src)",
      },
      insertionPoints: {
        avatar: {
          selector:
            '.pv-top-card--photo .profile-photo-edit__edit-btn, .pv-top-card--photo .pv-top-card__non-self-photo-wrapper',
          insertionType: 'before',
        },
        fullname: {
          selector: '.pv-top-card-v2-ctas',
          insertionType: 'before',
        },
      },
    },
  },
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'linkedin.com' } },
    },
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { eq: 'www.linkedin.com' } },
    },
  ],
})
