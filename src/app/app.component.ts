import { Component, ViewEncapsulation, OnInit} from '@angular/core'; 
import {CognitiveApiService} from './cognitive-api.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'cognitive-poc';
  currentImgUrl='';
  imgArr=[];
  targetTags=["sunglass", "hat", "mask", "blurry", "helmet", "wearing", "gun", "weapon","knife"] // can increase by real case study inspections
  tagIntersection=[];
  computeDanger="";
  dataLoaded: boolean = false;
  constructor(private cogService: CognitiveApiService) {
  }

  ngOnInit(){ 
    //training test
    this.imgArr = [ // read from hosted image or frames from stream video     
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrUFP2tPo4JjJj5NLV4T1xMoECYClKokHDQfNhWaxV7eDEN-PUCQ", 
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBEL6LdviLVYk6JAr2MCd0M3xxxZ4dPEx0rz0xG2BUYlD1pJZNeQ",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRFghgdhsbXgviRyY5UDRvYLmiJ2fqp9NtNmBE92pxKdZOBhSD",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWy4tSQbiDscVNxZBJ760PF0LfsopSA_XxUiVCJ1XK-y4LtYpD8Q",

      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKiLrXWNNvRPXpaAgHVSln-FiKn8ZfJJfoP0c9KrFs9xJ0Q7B9",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJkRoAgCWbZNdPcTNP90HCmShqY9rWadL3v_rekuKK7Z_fTwt8CA",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZjO2GDaw1bhn8-wqN83gA2B2dj9oNPbXb0i5vchePVv4TgyTA",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJIGpBBy34wRAyRuIb-D561ma4cEMYEWKLcu2SXymRj_xJdDdW",
      //caps
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOyLLmMmeyFVeywzA_Z2yVcbZApwPWnZGWU8C8WqxNgsocWD3jag",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWxwiFxoiS79Td1zsz_lOARsuiywaRTPMU8pIUCf_6hiGtLl9mfg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxBhdVTmStACS1SprQrqGadTXUhEDc_dNRfHCyXznLYYSgaQK7",
      //head cover
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfkd8txRfM2e8PydXYt2ECopVIAYG-ozOqjtoDjx2WNwmk--b6",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMQZZJUrixnp0A0Dqow0doIJUFG72XCPYnaPyMsvOcioW5cQFj"
    ]
  
    this.currentImgUrl = this.imgArr[0];




    this.cogService.getCognitiveIntel(this.currentImgUrl).subscribe((response:any)=>{
    
      console.log('JSON Response\n');
      console.log(response);

      
      let intersection= this.compareWithTargetTags(response);
      console.log('Intersection');
      console.log(intersection);
      this.tagIntersection =intersection;
      this.dataLoaded=true;
     }); 

  }


  calculateCustomDangerConfidence(detectedTags){ 
    let assentialTags= ["hat", "sunglass", "mask", "gun", "weapon", "knife"];
    let positiveDanger= _.intersection(detectedTags, assentialTags);

    let dangerConf= (this.tagIntersection.length / this.targetTags.length)*100;
     
    let computeDanger = (positiveDanger && positiveDanger.length > 0)? '100%': dangerConf.toFixed(0)+'%';
    this.computeDanger = computeDanger;
  }
  

  compareWithTargetTags(response){
    let tagsArray = (response.description && response.description.tags.length > 0) ? response.description.tags : [];

    this.calculateCustomDangerConfidence(tagsArray);

    let intersection =  _.intersection(tagsArray, this.targetTags);
    return intersection;
  }


  nextImg() {
  
    if (this.imgArr.indexOf(this.currentImgUrl) != this.imgArr.length - 1 && this.imgArr.indexOf(this.currentImgUrl) != -1) {
      this.dataLoaded=false;
      this.currentImgUrl = this.imgArr[this.imgArr.indexOf(this.currentImgUrl) + 1];


      this.cogService.getCognitiveIntel(this.currentImgUrl).subscribe((response:any)=>{
    
        console.log('JSON Response\n');
        console.log(response);

        let intersection= this.compareWithTargetTags(response);
        console.log('Intersection');
        console.log(intersection);
        this.tagIntersection =intersection;

        this.dataLoaded=true;

       }); 




    }
  }


  backImg() {
    if (this.imgArr.indexOf(this.currentImgUrl) > 0) {
      this.dataLoaded=false;
      this.currentImgUrl = this.imgArr[this.imgArr.indexOf(this.currentImgUrl) - 1]
      this.cogService.getCognitiveIntel(this.currentImgUrl).subscribe((response:any)=>{
    
        console.log('JSON Response\n');
        console.log(response);

        let intersection= this.compareWithTargetTags(response);
        console.log('Intersection');
        console.log(intersection);
        this.tagIntersection =intersection;

        this.dataLoaded=true;

       }); 

    }
  }
}
