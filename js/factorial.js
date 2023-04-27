//computing factorial of numbers using memoization
let dp = [];
function factorial(num) {
    if (num == 0 || num == 1)
        return 1;
    if (dp[num] > 0)
        return dp[num];
    return dp[num] = factorial(num - 1) * num;
}
export { factorial };
