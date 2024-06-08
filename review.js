let ratingStarInput = [...document.querySelector('.rating-star')];


ratingStarInput.map((star, index) => {
    star.addEventListener('click', () => {
        for(let i = 0; i < 5; i++){
            if(i <= index){
                ratingStarInput[i].src = `../img/fill star.png`;
        }else{
            ratingStarInput[i].src = `../img/no star.png`;
        }
    }
    })
})