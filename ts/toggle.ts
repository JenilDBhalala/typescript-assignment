//toggling functionalitites in first column when 2nd will click
function toggleFunctionalities(classes : DOMTokenList) : void {
    const firstFunc = document.querySelectorAll('.first') as NodeListOf<HTMLElement>;
    const secondFunc = document.querySelectorAll('.another') as NodeListOf<HTMLElement>;

    firstFunc.forEach((first : HTMLElement)=>{
        if(classes.contains('active')){
            first.style.display = 'none';
        }
        else{
            first.style.display = 'block'
        }
    })

    secondFunc.forEach((second : HTMLElement)=>{
        if(classes.contains('active')){
            second.style.display = 'block';
        }
        else{
            second.style.display = 'none'
        }
    })
}

export {toggleFunctionalities};