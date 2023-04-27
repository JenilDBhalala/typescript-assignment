//computing factorial of numbers using memoization
let dp : number[] = [];
function factorial(num : number) : number {
    if (num == 0 || num == 1)
        return 1;
    if (dp[num] > 0)
        return dp[num];
    return dp[num] = factorial(num - 1) * num;
}

export {factorial};