$(document).ready(function () {
let finalApi='https://api.themoviedb.org/3/movie/now_playing?api_key=799ed0086c94831bba561f971b5581f1&language=en-US&page=1';
let apiResponce,finalData;
let userLib = new Array();


loadContent = (finalData) =>{
    if(mode===0){
        document.getElementById('search-bar').removeAttribute('class')
    }
    else{
        document.getElementById('search-bar').setAttribute('class','hide');
    }
    document.getElementById('movieList').innerHTML='';            
            let i;
            for (i = 0; i < finalData.length; i++) { 
            let movie = document.createElement('DIV');
            movie.setAttribute('class','flex-item');
            
            let temp = document.createElement('img');
            if(finalData[i].poster_path){
                temp.setAttribute('src',('https://image.tmdb.org/t/p/w300/'+finalData[i].poster_path));
            }
            else{
                temp.setAttribute('src','./img/e404.jpeg');
            }
            movie.appendChild(temp);
            temp = document.createElement('button');
            temp.setAttribute('class','add-button');
            temp.setAttribute('id',i);
                if(mode===0){
                temp.setAttribute('onclick','addToLib(this.id)')
                temp.innerHTML='Add to my libraary';
                }
                else{
                    temp.setAttribute('onclick','removeFromLib(this.id)')
                    temp.innerHTML='Remove from libraary';
                }
                movie.appendChild(temp);
            
            temp = document.createElement('div');
            temp.setAttribute('class','movi-details');
            let temp1 = document.createElement('div');
            temp1.setAttribute('class','movie-name');
            temp1.innerHTML= finalData[i].original_title;
            temp.appendChild(temp1);
            temp1 = document.createElement('div');
            temp1.setAttribute('class','movie-year');
            temp1.innerHTML= parseInt(finalData[i].release_date);
            //finalData[i].release_date.substring(0, 4);;
            temp.appendChild(temp1);
            
            
            movie.appendChild(temp);
            
            document.getElementById('movieList').appendChild(movie);
          }
        
        
    }

    setData = () =>{
        if(mode===0)
        {
            if(!apiResponce){
                console.log("loading data from API")
                document.getElementById('movieList').innerHTML='';
                fetch(finalApi)
                .then(response => response.json())
                .then(data => {
                    apiResponce=data.results;
                    console.log(data);
                    
                    loadContent(apiResponce);
                    
                })
                .catch(error => console.error(error));
            }
            else{
                console.log('no need to fetch from API');
                loadContent(apiResponce);
            }
        }
        else{
            if(userLib.length===0){

                let emptyLib = document.createElement('div');
                emptyLib.setAttribute('class','emptyLib');
                emptyLib.innerHTML="Please add movies to library first";
                document.getElementById('movieList').innerHTML='';  
                document.getElementById('movieList').appendChild(emptyLib);
            }
            else{
                document.getElementById('movieList').innerHTML='';  
                loadContent(userLib);
            }

        }
    }


    modeChange = (id) =>{
        if(mode===1 && id==='search-btn' ){
            mode=0
            console.log("mode"+ " "+mode);
        }
        else{
            if(mode===0 && id==='lib-btn')
            {
                mode=1
                console.log("mode"+ " "+mode);
            }
        }
        setData();
    }
    search=()=>{
        let keyword= document.getElementById('search-bar').value;
        if(keyword!=''){
            finalApi='https://api.themoviedb.org/3/search/movie?api_key=799ed0086c94831bba561f971b5581f1&query='+keyword;
        }
        fetch(finalApi)
                .then(response => response.json())
                .then(data => {
                    apiResponce=data.results;
                })
                .catch(error => console.error(error));
        setData();
    }
    addToLib= (id) =>{
        console.log(id);
        userLib.push(apiResponce[id]);
        apiResponce.splice(id,1);
        setData();
        console.log(userLib);
        console.log(apiResponce);
    }

    removeFromLib = (id) =>{
        userLib.splice(id,1);
        setData();
    }
    
    sortList = (value) =>{
        if(userLib.length!==0){

            if(value==='name'){
                let sortedULib = userLib.sort( (a, b) => {
                    if( a.original_title > b.original_title) return 1;
                    else if(b.original_title > a.original_title) return -1;
                    else return 0;
                } );
                userLib=sortedULib;
            }
            if(value==='year'){
                let sortedULib = userLib.sort( (a, b) => {
                    if( parseInt(a.release_date) > parseInt(b.release_date)) return -1;
                    else if(parseInt(b.release_date) > parseInt(a.release_date)) return 1;
                    else return 0;
                } );
                userLib=sortedULib;
            }

            
            setData();
        }
        else{
            alert('can\'t sort empty libaray !!')
        }
    }
    


let mode=0; 
/* 
mode 0 means search and add movie section
mode 1 means user libaray section
*/
setData();





//console.log(document.getElementById('movieList'));
});