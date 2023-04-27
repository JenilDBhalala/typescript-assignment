const inputScreen = document.querySelector('.ip-screen') as HTMLElement;
const outputScreen = document.querySelector('.op-screen') as HTMLElement;

const bottomKeys = document.querySelector('.bottom-grid') as HTMLElement;
const topKeys = document.querySelector('.top-grid') as HTMLElement;

const trigonometry = document.querySelector('.trigonometry') as HTMLElement;
const trigonometryGrid = document.querySelector('.trigonometry-grid') as HTMLElement;
const functions = document.querySelector('.functions') as HTMLElement;

import { factorial } from './factorial.js'
import { toggleFunctionalities } from './toggle.js'
import { convertFloatingToDMS, convertDMSToFloating } from './floating-dms.js';


//instead of ((e.target as HTMLInputElement).classList.contains) on many elements i have used ((e.target as HTMLInputElement).closest)
//because some elements are deeper inside it's parent, so whenever this deeper child clicked then
//also parent event will be called. For Example in case of x^3, 10^x etc.



//str is useful for any manipulation on expression which is hide from the user.
let str : string = '';

let flag : boolean = false;

//for storing memory for operations like, M+, M-, MS, MR, MC
const memory : number[] = [];


//evaluating string when any operator is pressed
function evaluate(key : string) : void {
    console.log(str);
    if (outputScreen.innerText == '') {
        outputScreen.innerText = str + key;
    }
    else if (inputScreen.innerText.length > 0 && (str.includes('^') || str.includes('yroot') || str.includes('logbase'))) {
        if (str.includes('^')) {
            findOperands(key, '^');
        }
        else if (str.includes('yroot')) {
            findOperands(key, 'yroot');
        }
        else if (str.includes('logbase')) {
            findOperands(key, 'logbase')
            console.log("hello")
        }
    }
    else {
        const operators : string[] = ['+', '-', '/', '*', '%', '='];

        let newstr : string = '';
        if(operators.includes(str[str.length-1]) && key != '(' && key != ')'){
            newstr += str.slice(0, str.length-1);
            str = newstr;
        }

        outputScreen.innerText = str;

        try{
            inputScreen.innerText = eval(str);
        }
        catch(e){
            inputScreen.innerText = 'Unexpected Expression'
        }

        outputScreen.innerText = str + key;

    }
    str += key;
    flag = false;
    console.log(str);
}


//reverse the string
function reverseString(str : string) : string {
    return str.split('').reverse().join('')
}

//finding operands for x^y and yrootx functionalities
function findOperands(key : string, operator : string) : void {
    let revX : string = '';
    let posOfOperator1 : any, posOfOperator2 : any;
    const ops : string[] = ['*', '/', '%', '+', '-'];

    let y : number = Number(inputScreen.innerText);

    posOfOperator2 = str.indexOf(operator);

    for (let i : number = posOfOperator2 - 1; i >= 0; i--) {
        if (ops.includes(str[i])) {
            posOfOperator1 = i;
            break;
        }
        else {
            revX += str[i];
        }
    }

    let x : number = Number(reverseString(revX));

    let newstr : string = '';
    newstr += str.slice(0, posOfOperator1 + 1);
    if (operator == '^') {
        newstr += Math.pow(x, y);
    }
    else if (operator == 'yroot') {
        newstr += Math.pow(x, 1 / y);
    }
    else if (operator == 'logbase') {
        newstr += (Math.log(x) / Math.log(y));
    }
    str = newstr;

    outputScreen.innerText += inputScreen.innerText;
    inputScreen.innerText = eval(str);
    outputScreen.innerText += key;
    console.log(str);
}



//suppose i used multiple times sqrt then only concatenate final answer to the string
function removeFromBack() : void {
    const ops : string [] = ['*', '/', '%', '+', '-'];

    let len : number = str.length;
    let pos : any;
    for (let i : number = len - 1; i >= 0; i--) {
        if (ops.includes(str[i])) {
            pos = i;
            break;
        }
    }

    let newstr : string = str.slice(0, pos + 1);
    str = newstr;
}


//if after equalTo operator any number is come then delete everything
function removeAnythingComeAfterEqualTo() : void {
    let len : number = outputScreen.innerText.length;
    if(outputScreen.innerText[len-1] == '='){
        outputScreen.innerText = '';
        inputScreen.innerText = '';
        str = '';
    }
}


//evaluating bottom part functionalities on click event
bottomKeys.addEventListener('click', (e : MouseEvent) => {
    let classes : DOMTokenList = (e.target as HTMLInputElement).classList;
    let key : string = (e.target as HTMLInputElement).innerText;
   
    if (classes.contains('nums') || classes.contains('point')) {
        removeAnythingComeAfterEqualTo();

        if (inputScreen.innerText.length >= 0 && flag == false) {
            inputScreen.innerText = '';
            flag = true;
        }
        inputScreen.innerText = inputScreen.innerText + key;
        str += key;
        console.log(str)
    }
    // else if (classes.contains('op')) {
    else if ((e.target as HTMLInputElement).closest('.op')) {
        if (classes.contains('multiply')) {
            key = '*';
        }
        else if (classes.contains('division')) {
            key = '/';
        }
        else if (classes.contains('modulo')) {
            key = '%';
        }
        else if ((e.target as HTMLInputElement).closest('.xpowy')) {
            key = '^';
        }
        else if ((e.target as HTMLInputElement).closest('.ythroot')) {
            key = "yroot";
        }
        else if ((e.target as HTMLInputElement).closest('.logxbasey')) {
            key = "logbase";
        }
        evaluate(key);
    }
    else if (classes.contains('pi')) {
        inputScreen.innerText = eval(Math.PI.toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('euler')) {
        inputScreen.innerText = eval(Math.E.toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('delall')) {
        inputScreen.innerText = '';
        outputScreen.innerText = '';
        str = '';
    }
    else if ((e.target as HTMLInputElement).closest('.del')) {
        let txt : string = inputScreen.innerText;
        let newtxt : string = txt.slice(0, txt.length - 1);
        inputScreen.innerText = newtxt;

        removeFromBack();
        str += newtxt;
    }
    else if ((e.target as HTMLInputElement).closest('.square')) {
        inputScreen.innerText = eval(Math.pow(Number(inputScreen.innerText), 2).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if ((e.target as HTMLInputElement).closest('.cube')) {
        inputScreen.innerText = eval(Math.pow(Number(inputScreen.innerText), 3).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('pi')) {
        inputScreen.innerText = eval(Math.PI.toString());
        str += inputScreen.innerText;
    }
    else if (classes.contains('one-by-x')) {
        inputScreen.innerText = eval((1 / Number(inputScreen.innerText)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('abs')) {
        inputScreen.innerText = eval(Math.abs(Number(inputScreen.innerText)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('exp')) {
        inputScreen.innerText = eval(Math.pow(Math.E, Number(inputScreen.innerText)).toString());
        str += inputScreen.innerText;
    }
    else if (classes.contains('sqrt')) {
        inputScreen.innerText = eval(Math.pow(Number(inputScreen.innerText), 1 / 2).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('cbrt')) {
        inputScreen.innerText = eval(Math.pow(Number(inputScreen.innerText), 1 / 3).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('fact')) {
        inputScreen.innerText = factorial(Number(inputScreen.innerText)).toString();
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if ((e.target as HTMLInputElement).closest('.tenpowx')) {
        inputScreen.innerText = eval(Math.pow(10, Number(inputScreen.innerText)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if ((e.target as HTMLInputElement).closest('.twopowx')) {
        inputScreen.innerText = eval(Math.pow(2, Number(inputScreen.innerText)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('equal')) {
        evaluate(key);
    }
    else if (classes.contains('log')) {
        inputScreen.innerText = eval((Math.log(Number(inputScreen.innerText)) / Math.log(10)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('ln')) {
        inputScreen.innerText = eval(Math.log(Number(inputScreen.innerText)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if ((e.target as HTMLInputElement).closest('.epowx')) {
        inputScreen.innerText = eval(Math.pow(Math.E, Number(inputScreen.innerText)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (classes.contains('second-version')) {
        if (classes.contains('active')) {
            classes.remove('active');
        }
        else {
            classes.add('active');
        }
        toggleFunctionalities(classes);
    }
    else if (classes.contains('negate')) {
        inputScreen.innerText = eval((-1 * Number(inputScreen.innerText)).toString());
        removeFromBack();
        str += inputScreen.innerText;
    }
})



//evaluating top-part functionalities like memory functionalities, degree/radian and toExponential(F-E)
let degreeFlag : boolean = true;
let degreeOrRadian : string;

topKeys.addEventListener('click', (e) => {
    let classes : DOMTokenList = (e.target as HTMLInputElement).classList;
    let memoryClear : any = document.querySelector('.memory-clear');
    let memoryRestore : any = document.querySelector('.memory-restore');

    if (classes.contains('memory')) {
        if (classes.contains('memory-clear')) {
            memory.length = 0;
            memoryClear.disabled = true;
            memoryRestore.disabled = true;
        }
        else if (classes.contains('memory-restore')) {
            inputScreen.innerText = memory.slice(-1)[0].toString();
        }
        else if (classes.contains('memory-plus')) {
            if (memory.length == 0 && inputScreen.innerText.length == 0) {
                memory.push(0);
            }
            else if (memory.length == 0 && inputScreen.innerText.length > 0) {
                memory.push(eval(inputScreen.innerText));
            }
            else if (memory.length > 0 && inputScreen.innerText.length > 0) {
                memory[memory.length - 1] = eval(memory[memory.length - 1].toString()) + eval(inputScreen.innerText);
            }
            memoryClear.disabled = false;
            memoryRestore.disabled = false;
        }
        else if (classes.contains('memory-minus')) {
            if (memory.length == 0 && inputScreen.innerText.length == 0) {
                memory.push(0);
            }
            else if (memory.length == 0 && inputScreen.innerText.length > 0) {
                memory.push(eval('-' + inputScreen.innerText));
            }
            else if (memory.length > 0 && inputScreen.innerText.length > 0) {
                memory[memory.length - 1] = eval(memory[memory.length - 1].toString()) - eval(inputScreen.innerText);
            }
            memoryClear.disabled = false;
            memoryRestore.disabled = false;
        }
        else if (classes.contains('memory-store')) {
            if (inputScreen.innerText == '') {
                memory.push(0);
            }
            else if (inputScreen.innerText != '') {
                memory.push(eval(inputScreen.innerText));
            }
            memoryClear.disabled = false;
            memoryRestore.disabled = false;
        }
        console.log(memory)
        str = inputScreen.innerText;
    }
    else if ((e.target as HTMLInputElement).classList.contains('fminuse') && inputScreen.innerText.length > 0) {
        inputScreen.innerText = eval(inputScreen.innerText).toExponential();
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if ((e.target as HTMLInputElement).classList.contains('degree')) {
        (e.target as HTMLInputElement).classList.remove('degree');
        (e.target as HTMLInputElement).classList.add('radian');
        (e.target as HTMLInputElement).innerText = 'RAD';
        degreeFlag = false;
    }
    else if ((e.target as HTMLInputElement).classList.contains('radian')) {
        (e.target as HTMLInputElement).classList.remove('radian');
        (e.target as HTMLInputElement).classList.add('degree');
        (e.target as HTMLInputElement).innerText = 'DEG';
        degreeFlag = true;
    }
})



//displaying trigonometry-dropdown on click event
trigonometry.addEventListener('click', (e) => {
    let lastChildClass : any;

    if ((e.target as HTMLInputElement).lastElementChild != undefined) {
        lastChildClass = ((e.target as HTMLInputElement).lastElementChild as HTMLInputElement).classList;

        if (lastChildClass.contains('trigonometry-grid') && lastChildClass.contains('trigonometry-click')) {
            lastChildClass.remove('trigonometry-click');
        }
        else {
            lastChildClass.add('trigonometry-click');
        }
    }
})



//checking which trigonometry functionality enabled normal trigonometry, inverse-trigonometry, 
//hyperbolic-trigonometry or inverse-hyperbolic-trigonometry

let secondActiveFlag : boolean = false;
let hyperActiveFlag : boolean = false;

trigonometryGrid.addEventListener('click', (e) => {
    let normalFunctionalityFlag : boolean  = false;
    let inverseFunctionalityFlag : boolean = false;
    let hyperbolicFunctionalityFlag : boolean = false;
    let inverseHyperbolicFunctionalityFlag : boolean = false;

    let classes : DOMTokenList = (e.target as HTMLInputElement).classList;

    if (classes.contains('secondbtn')) {
        if (classes.contains('second-active')) {
            classes.remove('second-active');
            secondActiveFlag = false;
        }
        else {
            classes.add('second-active');
            secondActiveFlag = true;
        }
    }
    if (classes.contains('hypbtn')) {
        if (classes.contains('hyp-active')) {
            classes.remove('hyp-active');
            hyperActiveFlag = false;
        }
        else {
            classes.add('hyp-active');
            hyperActiveFlag = true;
        }
    }

    let trigonometryGridChildrens = (document.querySelector('.trigonometry-grid') as HTMLElement).children as HTMLCollectionOf<HTMLElement>;
    Array.from(trigonometryGridChildrens).forEach((child : HTMLElement) => {
        if (secondActiveFlag === false && hyperActiveFlag === false) {
            if (child.classList.contains('normal')) {
                child.style.display = 'block'
            }
            if (child.classList.contains('inverse')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('hyp')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('hyp-inverse')) {
                child.style.display = 'none'
            }
            normalFunctionalityFlag = true;
            inverseFunctionalityFlag = false;
            hyperbolicFunctionalityFlag = false;
            inverseHyperbolicFunctionalityFlag = false;
        }
        else if (secondActiveFlag === true && hyperActiveFlag === false) {
            if (child.classList.contains('normal')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('inverse')) {
                child.style.display = 'block'
            }
            if (child.classList.contains('hyp')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('hyp-inverse')) {
                child.style.display = 'none'
            }
            normalFunctionalityFlag = false;
            inverseFunctionalityFlag = true;
            hyperbolicFunctionalityFlag = false;
            inverseHyperbolicFunctionalityFlag = false;
        }
        else if (secondActiveFlag === false && hyperActiveFlag === true) {
            if (child.classList.contains('normal')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('inverse')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('hyp')) {
                child.style.display = 'block'
            }
            if (child.classList.contains('hyp-inverse')) {
                child.style.display = 'none'
            }
            normalFunctionalityFlag = false;
            inverseFunctionalityFlag = false;
            hyperbolicFunctionalityFlag = true;
            inverseHyperbolicFunctionalityFlag = false;
        }
        else if (secondActiveFlag === true && hyperActiveFlag === true) {
            if (child.classList.contains('normal')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('inverse')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('hyp')) {
                child.style.display = 'none'
            }
            if (child.classList.contains('hyp-inverse')) {
                child.style.display = 'block'
            }
            normalFunctionalityFlag = false;
            inverseFunctionalityFlag = false;
            hyperbolicFunctionalityFlag = false;
            inverseHyperbolicFunctionalityFlag = true;
        }
    })

    //checking if degree is enabled or radian is enabled
    if(degreeFlag === true){
        degreeOrRadian = (Number(inputScreen.innerText) * (Math.PI / 180)).toString();
    }
    else{
        degreeOrRadian = inputScreen.innerText;
    }


    //evaluating enabled normal trigonometry, inverse-trigonometry, hyperbolic-trigonometry or inverse-hyperbolic-trigonometry
    if (normalFunctionalityFlag as boolean === true) {
        if (classes.contains('sin')) {
            inputScreen.innerText = eval(Math.sin(Number(degreeOrRadian)).toString());
            console.log("hello sin")
        }
        else if (classes.contains('cos')) {
            inputScreen.innerText = eval(Math.cos(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('tan')) {
            inputScreen.innerText = eval(Math.tan(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('csc')) {
            inputScreen.innerText = eval((1 / Math.sin(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('sec')) {
            inputScreen.innerText = eval((1 / Math.cos(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('cot')) {
            inputScreen.innerText = eval((1 / Math.tan(Number(degreeOrRadian))).toString());
        }
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (inverseFunctionalityFlag as boolean === true) {
        if (classes.contains('sin')) {
            inputScreen.innerText = eval(Math.asin(Number(degreeOrRadian)).toString());
            console.log("hello inverse")
        }
        else if (classes.contains('cos')) {
            inputScreen.innerText = eval(Math.acos(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('tan')) {
            inputScreen.innerText = eval(Math.atan(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('csc')) {
            inputScreen.innerText = eval((1 / Math.asin(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('sec')) {
            inputScreen.innerText = eval((1 / Math.acos(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('cot')) {
            inputScreen.innerText = eval((1 / Math.atan(Number(degreeOrRadian))).toString());
        }
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (hyperbolicFunctionalityFlag as boolean === true) {
        if (classes.contains('sin')) {
            inputScreen.innerText = eval(Math.sinh(Number(degreeOrRadian)).toString());
            console.log("hello hyper")
        }
        else if (classes.contains('cos')) {
            inputScreen.innerText = eval(Math.cosh(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('tan')) {
            inputScreen.innerText = eval(Math.tanh(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('csc')) {
            inputScreen.innerText = eval((1 / Math.sinh(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('sec')) {
            inputScreen.innerText = eval((1 / Math.cosh(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('cot')) {
            inputScreen.innerText = eval((1 / Math.tanh(Number(degreeOrRadian))).toString());
        }
        removeFromBack();
        str += inputScreen.innerText;
    }
    else if (inverseHyperbolicFunctionalityFlag as boolean === true) {
        if (classes.contains('sin')) {
            inputScreen.innerText = eval(Math.asinh(Number(degreeOrRadian)).toString());
            console.log("hello inverse hyper")
        }
        else if (classes.contains('cos')) {
            inputScreen.innerText = eval(Math.acosh(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('tan')) {
            inputScreen.innerText = eval(Math.atanh(Number(degreeOrRadian)).toString());
        }
        else if (classes.contains('csc')) {
            inputScreen.innerText = eval((1 / Math.asinh(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('sec')) {
            inputScreen.innerText = eval((1 / Math.acosh(Number(degreeOrRadian))).toString());
        }
        else if (classes.contains('cot')) {
            inputScreen.innerText = eval((1 / Math.atanh(Number(degreeOrRadian))).toString());
        }
        removeFromBack();
        str += inputScreen.innerText;
    }
})



// functions dropdown
functions.addEventListener('click', (e) => {
    let lastChildClass : any;

    if ((e.target as HTMLInputElement).lastElementChild != undefined) {
        lastChildClass = ((e.target as HTMLInputElement).lastElementChild as HTMLInputElement).classList;

        if (lastChildClass.contains('functions-grid') && lastChildClass.contains('functions-click')) {
            lastChildClass.remove('functions-click');
        }
        else {
            lastChildClass.add('functions-click');
        }
    }
    else if ((e.target as HTMLInputElement).classList.contains('functions-grid-items')) {
        let classes = (e.target as HTMLInputElement).classList;

        if (classes.contains('floor')) {
            inputScreen.innerText = eval(Math.floor(Number(inputScreen.innerText)).toString());
        }
        else if (classes.contains('ceil')) {
            inputScreen.innerText = eval(Math.ceil(Number(inputScreen.innerText)).toString());
        }
        else if (classes.contains('abs')) {
            inputScreen.innerText = eval(Math.abs(Number(inputScreen.innerText)).toString());
        }
        else if (classes.contains('random')) {
            inputScreen.innerText = eval(Number(Math.random()).toString());
        }
        else if (classes.contains('dms')) {
            inputScreen.innerText = convertFloatingToDMS(Number(inputScreen.innerText));
        }
        else if (classes.contains('deg')) {
            let pos1 : number = inputScreen.innerText.indexOf('°');
            let pos2 : number = inputScreen.innerText.indexOf("'");
            let pos3 : number = inputScreen.innerText.indexOf('"');

            let degrees : string = inputScreen.innerText.slice(0, pos1);
            let minutes : string = inputScreen.innerText.slice(pos1+1, pos2);
            let seconds : string = inputScreen.innerText.slice(pos2+1, pos3);
            console.log(degrees, minutes, seconds);
            inputScreen.innerText = convertDMSToFloating(Number(degrees), Number(minutes), Number(seconds)).toString();
        }
        removeFromBack();
        str += inputScreen.innerText;
    }
})

