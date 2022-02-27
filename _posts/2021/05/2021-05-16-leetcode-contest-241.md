---   
layout:     post  
title: leetcode 第 241 场算法比赛  
description: 脑子不够用了，这么简单的DP没做出来。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-05-16 21:30:00  
published: true  
---  


## 零、背景  


不知道是不是好久没去健身房的原因，脑子不够用了。  


前三题半个小时写完，第四题静不下心来推导公式。  
最后十分钟发现是简单的DP时，时间已经不够了。  


源代码参考左下角的原文链接。  


## 一、找出所有子集的异或总和再求和  


题意：给一个数组，数组有很多子序列，每个子序列可以求出一个异或值，求所有异或值的和。  



思路：震惊，leetcode 第一题竟然这么难了，竟然要枚举子序列了。  


写一个递归方程，选择与不选择枚举出子序列即可。  


```
class Solution {
  vector<int> nums;
  int sum;
  int n;

  void dfs(int i, int pre) {
    if (i == n) {
      sum += pre;
      return;
    }

    dfs(i + 1, pre ^ nums[i]);
    dfs(i + 1, pre);
  }

 public:
  int subsetXORSum(vector<int> nums_) {
    nums.swap(nums_);
    n = nums.size();
    sum = 0;

    dfs(0, 0);

    return sum;
  }
}
```

## 二、构成交替字符串需要的最小交换次数  


题意：给一个二进制字符串，问是否可以通过交换字符使得二进制字符串的`01`字符交替出现。  


思路：

 
两个字符交替出现，第一个字符确定后，整个字符串都确定了。  
所以我们可以根据两个字符的个数来判断是否可以得到合法字符串，以及第一个字符是谁。  


根据个数的关系，可以分为四种情况。  


如果 0 比 1 的个数多一个，那么有一个合法字符串，0 必须是第一个字符。  
如果 0 与 1 的个数相等，那么有两个合法字符串，谁先谁后都可以。  
如果 0 比 1 的个数少一个，那么有一个合法字符串，1 必须是第一个字符。  
其他情况，没有答案。  



如果有合法字符串，与原字符串对比，不同的字符个数肯定是偶数个。  
交换一次可以减少两个不同字符，所以交换次数是不同字符的一半。 
枚举所有合法字符串时，取最小交换次数即可。  



```
class Solution {
  int GetDiffNum(int startFlag, const string& s) {
    int num = 0;
    int flag = startFlag;
    for (auto c : s) {
      int val = c - '0';
      if (flag != val) {
        num++;
      }
      flag = 1 - flag;
    }
    return num;
  }

 public:
  int minSwaps(string& s) {
    int zero = 0, one = 0;
    for (auto c : s) {
      if (c == '0') {
        zero++;
      } else {
        one++;
      }
    }

    if (zero == one + 1) {  // 010
      int num = GetDiffNum(0, s);
      return num / 2;

    } else if (zero == one) { // 01
      int num = min(GetDiffNum(1, s), GetDiffNum(0, s));
      return num / 2;
    } else if (zero + 1 == one) { // 101
      int num = GetDiffNum(1, s);
      return num / 2;
    } else {
      return -1;
    }
  }
};
```


## 三、找出和为指定值的下标对  


题意：给两个数组，有两个操作。  


操作1：对数组2的某个元素加上一个值。  
操作2：两个数组各取一个元素，两元素之和等于目标数的组合数。  


思路：


预处理：分别统计两个数组里每个数字出现的次数。  
查询操作：枚举小数组，在大数组里查询差值是否存在。  
修改操作：动态修改统计信息即可。  


```
class FindSumPairs {
  vector<int> nums2;
  unordered_map<ll, int> m1;
  unordered_map<ll, int> m2;

 public:
  FindSumPairs(vector<int>& nums1, vector<int>& nums2_) {
    nums2.swap(nums2_);

    for (auto c : nums1) {
      m1[c]++;
    }

    for (auto c : nums2) {
      m2[c]++;
    }
  }

  void add(int index, int val) {
    // 删除
    ll pre = nums2[index];
    auto it = m2.find(pre);
    it->second--;
    if (it->second == 0) {
      m2.erase(it);
    }

    // 增加
    nums2[index] += val;
    ll after = nums2[index];
    m2[after]++;
  }

  int count(int tot) {
    ll num = 0;
    for (auto& p : m1) {
      ll val = tot - p.first;
      auto it = m2.find(val);
      if (it == m2.end()) {
        continue;
      }
      num += p.second * it->second;
    }
    return num;
  }
};
```


## 四、恰有 K 根木棍可以看到的排列数目  


题意：给 n 个高度互不相同的木棍，问如何排列木棍，使得从左侧看到的木棍个数为 k 个。  
看到的定义：如果一个木棍左侧没有比自己高的木棍，则可以被看到。  
求满足要求的排列数。  


思路：面对这种题，很容易想到是动态规划，且只需要枚举最后的值，推导出公式即可。  


我比赛的时候，想的是枚举最长那个木棍的位置，发现很复杂，情况很多，没有耐心去推导，导致公式始终没推导出来。  


纠结了四十分钟，喝了一瓶牛奶，突然有了思路。  


状态定义：`f(n, k)` 求 n 个木棍能看到 k 个木棍的答案。  


方法一：枚举最长木棍的位置  


首先枚举最长木棍的位置，有`n`种情况。  
考虑到最长木棍之后的木棍都看不到了，状态需要看到 k 个木棍。  
这意味着，最后一根前面至少需要看到 `k-1` 个木棍，即前面至少需要有 `k-1`个木棍。  
所以最长木棍的位置有`n-(k-1)`种情况。   


假设最长木棍的位置是 i，则右侧有 `n-i` 个木棍，左侧有`i-1`个木棍，合法的情况数是`C(n-1, n-i)`。  
对于右侧的木棍，由于都看不见，所以可以任意排列，合法的情况数为`A(n-i, n-i)`
对于左侧的木棍，则符合定义，为 `i-1` 个木棍，有 `k-1` 个可以看见，所以为`f(i-1, k-1)`。  


综合上面的三种情况，可以得到公式：  


```
f(n,k) = sum(C(n-1, n-i) * A(n-i, n-i) * f(i-1, k-1))
```


上面的组合数与排列数可以合并，从而得到一个简化的公式  


```
f(n,k) = sum(A(n-1, n-i) * f(i-1, k-1))
```


考虑到这里，这道题可以跑出三个测试样例了。  
但是会超时。  
原因是复杂度太高，为`O(n^3)`  



面对动态规划，复杂度太高时，思路是对某些项做预处理，或者看某个`O(n)`循环是否可以在下次循环时复用。  


手动展开公式，发现`f(n,k)` 枚举公式时可以复用到  `f(n-1, k)`的枚举公式。  
所以这两个公式之间存在一个神奇的关系。  


```
f(n,k) = (n-1) * f(n-1, k) + f(n-1, k-1)
```


得到这个公式后，这道题就可以使用`O(n^2)`的复杂度来通过了。  


方法二：枚举最后一个位置的木棍  


如果枚举最后一个位置的木棍，会发现这道题特别简单。  


假设最后一个位置值最长的木棍，则子状态是`f(n-1, k-1)`。  
假设最后一个位置不是最长的，则肯定会被最长的挡住。  
即可以是任意一根，子状态是`(n-1) * f(n-1, k)`。  


两个合起来竟然是我们方法一推导出来的公式，神奇。  


```
ll dp[max3][max3];

class Solution {
  // 下标从 1 开始， [1, n][1, k]
  ll dfs(const int n, const int k) {
    if (dp[n][k] != -1) return dp[n][k];
    if (k == 0) return dp[n][k] = 0;
    if (k == n) return dp[n][k] = 1;

    ll a = dfs(n - 1, k);
    ll b = dfs(n - 1, k - 1);
    return dp[n][k] = ((n - 1) * a + b) % mod;
  }

 public:
  int rearrangeSticks(int n, int k) {
    memset(dp, -1, sizeof(dp));
    return dfs(n, k);
  }
};
```



## 五、最后


这次比赛前三题都是基础题，最后一题我想错方向了，导致思路一直不清晰。  
后来突然清晰之后，推导出一个公式，最终优化至`O(n^2)`复杂度，通过这道题。  
回头看看另一个方向，竟然是那么简单明了。  


以后做比赛看来有必要两个方向都想一想，要么枚举最优一个位置，要么枚举最大值的位置。  
两个最终肯定是等价的，但是有一个会比较简单，另一个则较为复杂。  


这些题你都是怎么做的呢？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

