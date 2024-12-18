const twoSums = function (nums: number[], target: number) {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) return [i, map.get(complement)];

    map.set(nums[i], i);
  }
};
