/**
 * 
 * @param n 
 * @returns 
 * 
 * time complexity: O(n)
 * space complexity: O(n)
 * 
 * A simple iterative approach to sum numbers from 1 to n.
 */
function sum_to_n_a(n: number): number {
    let result = 0;
    for (let i = 1; i <= n; i++) {
        result += i;
    }
    return result;
}

/**
 * 
 * @param n 
 * @returns 
 * 
 * time complexity: O(1)
 * space complexity: O(1)
 * 
 * Using the mathematical formula to calculate the sum from 1 to n.
 */
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}

/**
 * 
 * @param n 
 * @returns 
 * 
 * time complexity: O(n)
 * space complexity: O(n)
 * 
 * A simple recursive approach to sum numbers from 1 to n.
 */
function sum_to_n_c(n: number): number {
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
}