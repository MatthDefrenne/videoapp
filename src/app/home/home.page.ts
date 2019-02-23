import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { trigger, transition, animate, style } from '@angular/animations'
import { timeout } from 'q';
import { promise } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]

})
export class HomePage {




  videos: Array<string>;

  videoSelected: string;
  currentIndex = 0;
  visible = true;
  localVideos: any = [];
  isLoading = true;
  constructor(private domSanitizer: DomSanitizer) {
    this.videos = ["https://gcs-vimeo.akamaized.net/exp=1550177954~acl=%2A%2F941676883.mp4%2A~hmac=ae0d6a4a927f41f44fa7eb0c9018b5e10fccb296c11d783fce51cda6dd5fa32b/vimeo-prod-skyfire-std-us/01/1421/10/257108389/941676883.mp4", "https://gcs-vimeo.akamaized.net/exp=1550177997~acl=%2A%2F941676987.mp4%2A~hmac=4630641a79fb77be1fcbd9fd3decb61ff29290df1c20d18b38a3327ee83d3a1b/vimeo-prod-skyfire-std-us/01/1421/10/257108413/941676987.mp4", "https://gcs-vimeo.akamaized.net/exp=1550179481~acl=%2A%2F941676386.mp4%2A~hmac=3e15e79775a10538a415357cb44bece8ee06ccc628747f82e1cba24065e3a5d8/vimeo-prod-skyfire-std-us/01/1421/10/257108267/941676386.mp4", "https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/1421/10/257107862/941674463.mp4?token=1550179580-0x4eecebd8eed5ce209a72abb8a007ce6e04c0896d"]
      this.preloadAllVideos().then(() => {
        console.log(this.localVideos[this.currentIndex]);
        var doc: any = document.getElementById("videoApp")
        doc.src = this.localVideos[this.currentIndex]
        this.isLoading = false;
      });
    }

  
  nextVideo()  {
    this.isLoading = true;
      var doc: any = document.getElementById("videoApp")
      doc.src = this.localVideos[this.currentIndex += 1]
      this.isLoading = false;
  }

  previousVideo()  {
    this.isLoading = true;
      var doc: any = document.getElementById("videoApp")
      doc.src =     this.videoSelected = this.localVideos[this.currentIndex == 0 ? this.currentIndex = 0 : this.currentIndex -= 1];
      this.isLoading = false;

  }


  preloadAllVideos() {
    var localVideo = [];
    return new Promise((resolve, reject) => {
      this.videos.forEach(video => {
        this.makeRequest("GET", video).then((url) => {
          this.localVideos.push(url);
          resolve();
        })
      })
    })
  }


  makeRequest (method, url) {
    return new Promise(function (resolve, reject) {

      var req = new XMLHttpRequest();
      req.open(method, url, true);
      req.responseType = 'blob';

      req.onload = function() {
        // Onload is triggered even on 404
        // so we need to check the status code
        if (this.status === 200) {
          var videoBlob = this.response;
          var vid = URL.createObjectURL(videoBlob); // IE10+
          resolve(vid);
       }
      }
      req.onerror = function() {
        // Error
      }

      req.send();
    })
  }
  // Example:
}
