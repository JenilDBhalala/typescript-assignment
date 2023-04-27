//toggling functionalitites in first column when 2nd will click
function toggleFunctionalities(classes) {
    const firstFunc = document.querySelectorAll('.first');
    const secondFunc = document.querySelectorAll('.another');
    firstFunc.forEach((first) => {
        if (classes.contains('active')) {
            first.style.display = 'none';
        }
        else {
            first.style.display = 'block';
        }
    });
    secondFunc.forEach((second) => {
        if (classes.contains('active')) {
            second.style.display = 'block';
        }
        else {
            second.style.display = 'none';
        }
    });
}
export { toggleFunctionalities };
