// @ts-ignore
import plugin from './index';

describe('AEP IAM Request', () => {
  it('should valiadate request scopes', () => {
    const result = plugin([
      {
        uuid: 'ecb73d73-d64b-469d-9f1f-3b26f00d0a32',
        eventNumber: 57,
        clientId: 'EDE0307C-E667-4933-9AB5-4990F398F15D',
        timestamp: 1649793772385,
        vendor: 'com.adobe.griffon.mobile',
        type: 'generic',
        payload: {
          ACPExtensionEventType: 'com.adobe.eventtype.edge',
          ACPExtensionEventTimestamp: 1649793772385.0752,
          ACPExtensionEventData: {
            payload: [
              {
                activity: {
                  etag: '113',
                  id: 'xcore:offer-activity:14a161ea55e38721'
                },
                id: '0b5c4111-c2de-46e4-837d-9d2b279981e8',
                placement: {
                  etag: '1',
                  id: 'xcore:offer-placement:14fa28fa767c965a'
                },
                items: [
                  {
                    etag: '1',
                    id: 'xcore:personalized-offer:14fad6e7665f7c33',
                    data: {
                      characteristics: {
                        inappmessageExecutionId: 'UIA-05358471'
                      },
                      id: 'xcore:personalized-offer:14fad6e7665f7c33',
                      content:
                        '{"version":1,"rules":[{"condition":{"type":"group","definition":{"conditions":[{"definition":{"conditions":[{"definition":{"key":"~source","matcher":"eq","values":["com.adobe.eventSource.requestContent"]},"type":"matcher"},{"definition":{"key":"~type","matcher":"eq","values":["com.adobe.eventType.generic.track"]},"type":"matcher"},{"definition":{"key":"state","matcher":"eq","values":["commerce.productListAdds"]},"type":"matcher"}],"logic":"and"},"type":"group"}],"logic":"and"}},"consequences":[{"id":"22dee69f-4dcb-4767-8ed6-4a4736b6dc44","type":"cjmiam","detail":{"remoteAssets":["https://d14dq8eoa1si34.cloudfront.net/2a6ef2f0-1167-11eb-88c6-b512a5ef09a7/urn:aaid:aem:fbdf5219-9103-432c-bdbd-469601dd8006/oak:1.0::ci:d101758bf3a8fcf5b343c6a8c08c4556/9eaa320c-ac12-3f60-844a-5a69deb9a666"],"mobileParameters":{"verticalAlign":"center","dismissAnimation":"left","schemaVersion":"0.0.1","verticalInset":0.0,"backdropOpacity":0.78,"gestures":{"swipeUp":"adbinapp://dismiss?interaction=swipeUp","swipeDown":"adbinapp://dismiss?interaction=swipeDown","swipeLeft":"adbinapp://dismiss?interaction=swipeLeft","swipeRight":"adbinapp://dismiss?interaction=swipeRight","tapBackground":"adbinapp://dismiss?interaction=tapBackground"},"horizontalInset":0.0,"uiTakeover":true,"horizontalAlign":"center","width":80.0,"displayAnimation":"left","backdropColor":"#000000","height":60.0},"html":"<html>\\n<head>\\n\\t<meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n\\t<meta charset=\\"UTF-8\\">\\n\\t<style>\\n\\t\\thtml,\\n\\t\\tbody {\\n\\t\\t\\tmargin: 0;\\n\\t\\t\\tpadding: 0;\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\theight: 100%;\\n\\t\\t\\tfont-family: adobe-clean, \\"Source Sans Pro\\", -apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, sans-serif;\\n\\t\\t}\\n\\n\\t\\t.body {\\n\\t\\t\\tdisplay: flex;\\n\\t\\t\\tflex-direction: column;\\n\\t\\t\\tbackground-color: #FFF;\\n\\t\\t\\tborder-radius: 5px;\\n\\t\\t\\tcolor: #333333;\\n\\t\\t\\twidth: 100vw;\\n\\t\\t\\theight: 100vh;\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\talign-items: center;\\n\\t\\t\\tbackground-size: \'cover\';\\n\\t\\t}\\n\\n\\t\\t.content {\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\theight: 100%;\\n\\t\\t\\tdisplay: flex;\\n\\t\\t\\tjustify-content: center;\\n\\t\\t\\tflex-direction: column;\\n\\t\\t\\tposition: relative;\\n\\t\\t}\\n\\n\\t\\ta {\\n\\t\\t\\ttext-decoration: none;\\n\\t\\t}\\n\\n\\t\\t.image {\\n\\t\\t  height: 1rem;\\n\\t\\t  flex-grow: 4;\\n\\t\\t  flex-shrink: 1;\\n\\t\\t  display: flex;\\n\\t\\t  justify-content: center;\\n\\t\\t  width: 90%;\\n          flex-direction: column;\\n          align-items: center;\\n        }\\n        .image img {\\n          max-height: 100%;\\n          max-width: 100%;\\n        }\\n\\t\\t.text {\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\tline-height: 20px;\\n\\t\\t\\tfont-size: 14px;\\n\\t\\t\\tcolor: #333333;\\n\\t\\t\\tline-height: 1.25rem;\\n\\t\\t\\tfont-size: 0.875rem;\\n\\t\\t\\tpadding: 0 0.8rem;\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\tbox-sizing: border-box;\\n\\t\\t}\\n\\t\\t.title {\\n\\t\\t\\tline-height: 1.3125rem;\\n\\t\\t\\tfont-size: 1.025rem;\\n\\t\\t}\\n\\n\\t\\t.buttons {\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\tdisplay: flex;\\n\\t\\t\\tflex-direction: column;\\n\\t\\t\\tfont-size: 1rem;\\n\\t\\t\\tline-height: 1.3rem;\\n\\t\\t\\ttext-decoration: none;\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\tbox-sizing: border-box;\\n\\t\\t\\tpadding: .8rem;\\n\\t\\t\\tpadding-top: .4rem;\\n\\t\\t\\tgap: 0.3125rem;\\n\\t\\t}\\n\\n\\t\\t.button {\\n\\t\\t\\tflex-grow: 1;\\n\\t\\t\\tbackground-color: #1473E6;\\n\\t\\t\\tcolor: #FFFFFF;\\n\\t\\t\\tborder-radius: .25rem;\\n\\t\\t\\tcursor: pointer;\\n\\t\\t\\tpadding: .3rem;\\n\\t\\t\\tgap: .5rem;\\n\\t\\t}\\n\\n\\t\\t.btnClose {\\n\\t\\t\\tcolor: #000000;\\n\\t\\t}\\n\\n\\t\\t.closeBtn {\\n\\t\\t\\talign-self: flex-end;\\n\\t\\t\\tcolor: #000000;\\n\\t\\t\\twidth: 1.8rem;\\n\\t\\t\\theight: 1.8rem;\\n\\t\\t\\tmargin-top: 1rem;\\n\\t\\t\\tmargin-right: .3rem;\\n\\t\\t}\\n\\t</style>\\n\\t<style type=\\"text/css\\" id=\\"editor-styles\\">\\n\\n</style>\\n</head>\\n\\n<body>\\n\\t<div class=\\"body\\">\\n    <div class=\\"closeBtn\\" data-btn-style=\\"plain\\" data-uuid=\\"b24976b1-32ca-4018-89ec-57268e29eb51\\">\\n  <a aria-label=\\"Close\\" class=\\"btnClose\\" href=\\"adbinapp://dismiss?interaction=cancel\\" role=\\"button\\">\\n    <svg xmlns=\\"http://www.w3.org/2000/svg\\" height=\\"18\\" viewbox=\\"0 0 18 18\\" width=\\"18\\" class=\\"close\\">\\n  <rect id=\\"Canvas\\" fill=\\"#ffffff\\" opacity=\\"0\\" width=\\"18\\" height=\\"18\\" />\\n  <path fill=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\" d=\\"M13.2425,3.343,9,7.586,4.7575,3.343a.5.5,0,0,0-.707,0L3.343,4.05a.5.5,0,0,0,0,.707L7.586,9,3.343,13.2425a.5.5,0,0,0,0,.707l.707.7075a.5.5,0,0,0,.707,0L9,10.414l4.2425,4.243a.5.5,0,0,0,.707,0l.7075-.707a.5.5,0,0,0,0-.707L10.414,9l4.243-4.2425a.5.5,0,0,0,0-.707L13.95,3.343a.5.5,0,0,0-.70711-.00039Z\\" />\\n</svg>\\n  </a>\\n</div><div class=\\"image\\" data-uuid=\\"8f829f8a-04f7-43ac-852e-844b33cc38df\\">\\n  <img src=\\"https://d14dq8eoa1si34.cloudfront.net/2a6ef2f0-1167-11eb-88c6-b512a5ef09a7/urn:aaid:aem:fbdf5219-9103-432c-bdbd-469601dd8006/oak:1.0::ci:d101758bf3a8fcf5b343c6a8c08c4556/9eaa320c-ac12-3f60-844a-5a69deb9a666\\" alt=\\"\\">\\n</div><div class=\\"text\\" data-uuid=\\"e95636ac-6848-4ab8-b7a1-fb6e9bf5e3c6\\">\\n<h3>Luma Special Offer</h3>\\n<p>Thank you for being a valued customer. Get free shipping on orders greater than $40 today!</p>\\n</div><div data-uuid=\\"9c9405ac-0f0d-421e-91ce-87704bf0eb30\\" class=\\"buttons\\">\\n  <a class=\\"button\\" data-uuid=\\"c6bc85f2-8ca7-4928-bfe4-72a616c541cf\\" href=\\"adbinapp://dismiss?interaction=confirm\\">Continue Shopping</a>\\n</div>\\n\\t</div>\\n\\n\\n</body></html>","_xdm":{"mixins":{"_experience":{"customerJourneyManagement":{"messageExecution":{"messageExecutionID":"UIA-05358471","messageID":"17d1dc04-b738-4790-9825-7ba5acacf68c","messagePublicationID":"7c58a584-0fb4-46dd-b3ca-7110aef55d5f","campaignID":"db2d52e5-897b-44ca-9a3d-7cb38234209b","campaignVersionID":"c5ea4156-e923-41d5-bd00-daae0c471bc8"},"messageProfile":{"channel":{"_id":"https://ns.adobe.com/xdm/channels/inapp"}}}}}}}}]}]}',
                      format: 'application/json'
                    },
                    schema:
                      'https://ns.adobe.com/experience/offer-management/content-component-json'
                  },
                  {
                    etag: '1',
                    data: {
                      characteristics: {
                        inappmessageExecutionId: 'UIA-71923875'
                      },
                      id: 'xcore:personalized-offer:14fbf91e8e238290',
                      content:
                        '{"version":1,"rules":[{"condition":{"type":"group","definition":{"conditions":[{"definition":{"conditions":[{"definition":{"key":"~source","matcher":"eq","values":["com.adobe.eventSource.requestContent"]},"type":"matcher"},{"definition":{"key":"~type","matcher":"eq","values":["com.adobe.eventType.generic.track"]},"type":"matcher"},{"definition":{"key":"action","matcher":"eq","values":["ArchanaTesting"]},"type":"matcher"}],"logic":"and"},"type":"group"}],"logic":"and"}},"consequences":[{"id":"fcae186f-00c1-4b02-bcb6-022d196eb4e8","type":"cjmiam","detail":{"remoteAssets":["https://d14dq8eoa1si34.cloudfront.net/2a6ef2f0-1167-11eb-88c6-b512a5ef09a7/urn:aaid:aem:f083d95e-4c49-4d2e-acae-446440e81128/oak:1.0::ci:3d6c85a9828305e62815739bd2db2ec7/75475a14-7189-31d9-9472-9b8e722a8342"],"mobileParameters":{"horizontalInset":0.0,"verticalAlign":"center","dismissAnimation":"bottom","schemaVersion":"0.0.1","uiTakeover":true,"horizontalAlign":"center","verticalInset":0.0,"width":100.0,"displayAnimation":"bottom","gestures":{},"height":100.0},"html":"<html>\\n<head>\\n\\t<meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n\\t<meta charset=\\"UTF-8\\">\\n\\t<style>\\n\\t\\thtml,\\n\\t\\tbody {\\n\\t\\t\\tmargin: 0;\\n\\t\\t\\tpadding: 0;\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\theight: 100%;\\n\\t\\t\\tfont-family: adobe-clean, \\"Source Sans Pro\\", -apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, sans-serif;\\n\\t\\t}\\n\\n    h3 {\\n\\t\\t\\tmargin: .1rem auto;\\n\\t\\t}\\n\\t\\tp {\\n\\t\\t\\tmargin: 0;\\n\\t\\t}\\n\\n\\t\\t.body {\\n\\t\\t\\tdisplay: flex;\\n\\t\\t\\tflex-direction: column;\\n\\t\\t\\tbackground-color: #FFF;\\n\\t\\t\\tborder-radius: 5px;\\n\\t\\t\\tcolor: #333333;\\n\\t\\t\\twidth: 100vw;\\n\\t\\t\\theight: 100vh;\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\talign-items: center;\\n\\t\\t\\tbackground-size: \'cover\';\\n\\t\\t}\\n\\n\\t\\t.content {\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\theight: 100%;\\n\\t\\t\\tdisplay: flex;\\n\\t\\t\\tjustify-content: center;\\n\\t\\t\\tflex-direction: column;\\n\\t\\t\\tposition: relative;\\n\\t\\t}\\n\\n\\t\\ta {\\n\\t\\t\\ttext-decoration: none;\\n\\t\\t}\\n\\n\\t\\t.image {\\n\\t\\t  height: 1rem;\\n\\t\\t  flex-grow: 4;\\n\\t\\t  flex-shrink: 1;\\n\\t\\t  display: flex;\\n\\t\\t  justify-content: center;\\n\\t\\t  width: 90%;\\n      flex-direction: column;\\n      align-items: center;\\n\\t\\t}\\n    .image img {\\n      max-height: 100%;\\n      max-width: 100%;\\n    }\\n\\n\\t\\t.text {\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\tline-height: 20px;\\n\\t\\t\\tfont-size: 14px;\\n\\t\\t\\tcolor: #333333;\\n\\t\\t\\tline-height: 1.25rem;\\n\\t\\t\\tfont-size: 0.875rem;\\n\\t\\t\\tpadding: 0 0.8rem;\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\tbox-sizing: border-box;\\n\\t\\t}\\n\\t\\t.title {\\n\\t\\t\\tline-height: 1.3125rem;\\n\\t\\t\\tfont-size: 1.025rem;\\n\\t\\t}\\n\\n\\t\\t.buttons {\\n\\t\\t\\twidth: 100%;\\n\\t\\t\\tdisplay: flex;\\n\\t\\t\\tflex-direction: column;\\n\\t\\t\\tfont-size: 1rem;\\n\\t\\t\\tline-height: 1.3rem;\\n\\t\\t\\ttext-decoration: none;\\n\\t\\t\\ttext-align: center;\\n\\t\\t\\tbox-sizing: border-box;\\n\\t\\t\\tpadding: .8rem;\\n\\t\\t\\tpadding-top: .4rem;\\n\\t\\t\\tgap: 0.3125rem;\\n\\t\\t}\\n\\n\\t\\t.button {\\n\\t\\t\\tflex-grow: 1;\\n\\t\\t\\tbackground-color: #1473E6;\\n\\t\\t\\tcolor: #FFFFFF;\\n\\t\\t\\tborder-radius: .25rem;\\n\\t\\t\\tcursor: pointer;\\n\\t\\t\\tpadding: .3rem;\\n\\t\\t\\tgap: .5rem;\\n\\t\\t}\\n\\n\\t\\t.btnClose {\\n\\t\\t\\tcolor: #000000;\\n\\t\\t}\\n\\n\\t\\t.closeBtn {\\n\\t\\t\\talign-self: flex-end;\\n\\t\\t\\twidth: 1.8rem;\\n\\t\\t\\theight: 1.8rem;\\n\\t\\t\\tmargin-top: 1rem;\\n\\t\\t\\tmargin-right: .3rem;\\n\\t\\t}\\n\\t</style>\\n\\t<style type=\\"text/css\\" id=\\"editor-styles\\">\\nbody .body {\\n  background-color: rgba(255, 212, 212, 1);\\n}\\n</style>\\n</head>\\n\\n<body>\\n\\t<div class=\\"body\\">\\n    <div class=\\"closeBtn\\" data-btn-style=\\"circle\\" data-uuid=\\"07092b5b-c486-461d-b431-9f85acb11bbb\\">\\n  <a aria-label=\\"Close\\" class=\\"btnClose\\" href=\\"adbinapp://dismiss?interaction=cancel\\" role=\\"button\\">\\n    <svg xmlns=\\"http://www.w3.org/2000/svg\\" height=\\"18\\" viewbox=\\"0 0 18 18\\" width=\\"18\\" class=\\"close\\">\\n  <rect id=\\"Canvas\\" fill=\\"#ffffff\\" opacity=\\"0\\" width=\\"18\\" height=\\"18\\" />\\n  <path fill=\\"currentColor\\" d=\\"M14.657,3.343a8,8,0,1,0-.00021,11.31371l.00021-.00021A8,8,0,0,0,14.657,3.343Zm-1.3435,9.265-.707.7055a.6.6,0,0,1-.84853.00147l-.00147-.00147L9,10.5555l-2.758,2.758a.6.6,0,0,1-.84853.00147L5.392,13.3135l-.7045-.7075a.6.6,0,0,1-.00147-.84853L4.6875,11.756,7.4445,9,4.6875,6.242A.6.6,0,0,1,4.686,5.39347L4.6875,5.392l.707-.707A.6.6,0,0,1,6.243,4.68353L6.2445,4.685,9,7.444l2.758-2.7575a.6.6,0,0,1,.84853-.00147l.00147.00147.707.707a.6.6,0,0,1,.00147.84853L13.315,6.2435,10.5555,9l2.758,2.758a.6.6,0,0,1,.00147.84853Z\\" />\\n</svg>\\n  </a>\\n</div><div class=\\"image\\" data-uuid=\\"4262c498-9154-43c6-a53a-a62b2f3e1a29\\">\\n  <img src=\\"https://d14dq8eoa1si34.cloudfront.net/2a6ef2f0-1167-11eb-88c6-b512a5ef09a7/urn:aaid:aem:f083d95e-4c49-4d2e-acae-446440e81128/oak:1.0::ci:3d6c85a9828305e62815739bd2db2ec7/75475a14-7189-31d9-9472-9b8e722a8342\\" alt=\\"\\">\\n</div><div class=\\"text\\" data-uuid=\\"a0c28cc1-3ed0-4ea4-b371-21641dc8b938\\">\\n<h3>Luma Studio Classes</h3>\\n<p>Check out our studio yoga classes! We are back to in-person classes.</p>\\n</div><div data-uuid=\\"bb1b0019-aaf3-412a-bb76-1d0bc9bbe6c7\\" class=\\"buttons\\">\\n  <a class=\\"button\\" data-uuid=\\"843fb4b3-eb88-4ba7-a9b7-c46d79f28a2f\\" href=\\"adbinapp://dismiss?interaction=confirm\\">See schedule</a>\\n</div>\\n\\t</div>\\n\\n\\n</body></html>","_xdm":{"mixins":{"_experience":{"customerJourneyManagement":{"messageExecution":{"messageExecutionID":"UIA-71923875","messageID":"aa3abe9b-052a-4326-866d-cdde12110b36","messagePublicationID":"33caf2fe-28b4-43e3-aca2-e6fc33d1a14f","campaignID":"12f1bdbf-e348-4feb-b741-cf1ddd5bf8c4","campaignVersionID":"b9521cbb-abc8-4304-9b43-498214f6e409"},"messageProfile":{"channel":{"_id":"https://ns.adobe.com/xdm/channels/inapp"}}}}}}}}]}]}',
                      format: 'application/json'
                    },
                    id: 'xcore:personalized-offer:14fbf91e8e238290',
                    schema:
                      'https://ns.adobe.com/experience/offer-management/content-component-json'
                  }
                ],
                scope:
                  'eyJ4ZG06bmFtZSI6ImNvbS5hZG9iZS5kZW1vc3lzdGVtLmR4ZGVtbyJ9'
              }
            ],
            requestId: 'D8415B37-3F80-4348-8C72-3A133254B6B2',
            type: 'personalization:decisions',
            requestEventId: 'A6C43EFB-24C9-44B9-BF3E-383D676E4DB7'
          },
          ACPExtensionEventSource: 'personalization:decisions',
          ACPExtensionEventName: 'AEP Response Event Handle',
          ACPExtensionEventUniqueIdentifier:
            '2F95780E-020D-4481-B75F-A477D76ED3DB'
        },
        annotations: []
      },
      {
        uuid: 'd3388f01-04ce-46a3-a19e-76e454da762b',
        eventNumber: 50,
        clientId: 'EDE0307C-E667-4933-9AB5-4990F398F15D',
        timestamp: 1649793772242,
        vendor: 'com.adobe.griffon.mobile',
        type: 'generic',
        payload: {
          ACPExtensionEventType: 'com.adobe.eventtype.edge',
          ACPExtensionEventTimestamp: 1649793772241.6238,
          ACPExtensionEventData: {
            xdm: {
              eventType: 'personalization.request'
            },
            query: {
              personalization: {
                decisionScopes: [
                  'eyJ4ZG06bmFtZSI6ImNvbS5hZG9iZS5kZW1vc3lzdGVtLmR4ZGVtbyJ9'
                ]
              }
            }
          },
          ACPExtensionEventSource: 'com.adobe.eventsource.requestcontent',
          ACPExtensionEventUniqueIdentifier:
            'EBE2D71A-D726-4882-808B-A3C5D2ED6FCE',
          ACPExtensionEventName: 'Edge Optimize Personalization Request'
        },
        annotations: []
      }
    ]);
  });
});
