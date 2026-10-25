---
layout: post  
title: leetcode 周赛 525 - 排名 43  
description: 贪心与频次阶梯枚举  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-10-25 12:13:00  
published: true  
---


## 零、背景


这次比赛第三题和第四题是同一道题，只有数据范围不同。  
第三题的代码在第四题上超时了，加了一个关键剪枝后通过，最终排名第 43 名。  
另外两题分别是模拟和贪心，都比较简单。  


本场题型概览如下。  


A 题：模拟  
B 题：贪心  
C 题：枚举 + 最小堆  
D 题：枚举 + 最小堆 + 剪枝  


## 一、二进制位得分


题意：给你两个整数 `a` 和 `b`。  
设 `s1` 和 `s2` 分别为 `a` 和 `b` 的二进制表示中置位（值为 1 的位）的数量。  
这两个整数的得分定义如下：如果 `s1 >= s2`，得分为 `s1 * s2`；否则得分为 `s2 / s1`，其中除法采用整数除法。  
返回表示 `a` 和 `b` 得分的整数。  


数据范围：  
`1 <= a, b <= 100`  


思路：模拟  


直接用 `__builtin_popcount` 计算两个数的二进制置位数，然后按题意比较大小，选择对应的公式计算即可。  


复杂度：`O(1)`  


```cpp
class Solution {
 public:
  int calculateScore(int a, int b) {
    int s1 = __builtin_popcount(a);
    int s2 = __builtin_popcount(b);
    if (s1 >= s2) {
      return s1 * s2;
    } else {
      return s2 / s1;
    }
  }
};
```


## 二、至多 K 次数字重排后的最大和


题意：给你一个长度为 `n` 的整数数组 `nums` 和一个整数 `k`。  
在一次操作中，你可以选择 `nums` 中的任意一个元素，并以任意顺序重新排列其十进制数字，组成一个新的整数。  
返回在执行至多 `k` 次操作后，数组元素之和的最大值。  


数据范围：  
`1 <= n == nums.length <= 10^5`  
`1 <= nums[i] <= 10^9`  
`1 <= k <= n`  


思路：贪心  


对一个数字重新排列十进制位，要使它最大，显然是把所有数字从大到小排序（如 `123 -> 321`、`102 -> 210`）。  
一次操作可以让该元素增加一个确定的值：`增加量 = 最大重排值 - 原值`。  
由于每个元素重排一次后即达到最大值，再次重排没有收益，所以 k 次操作等价于选择「增加量」最大的 k 个元素各操作一次。  
先算出每个元素的增加量，按增加量从大到小排序，答案等于原始数组和加上前 k 个增加量。  


复杂度：`O(n log n)`  


```cpp
typedef long long ll;

class Solution {
  ll CalDis(const ll v) {
    string s = to_string(v);
    sort(s.begin(), s.end(), greater<char>());
    return stoll(s) - v;
  }

 public:
  long long maximizeSum(vector<int>& nums, int k) {
    int n = nums.size();
    vector<pair<ll, ll>> A(n);
    ll sum = 0;
    for (int i = 0; i < n; i++) {
      ll v = nums[i];
      ll dis = CalDis(v);
      A[i] = {dis, v};
      sum += v;
    }
    sort(A.begin(), A.end(), greater<pair<ll, ll>>());
    ll ans = sum;
    for (int i = 0; i < k; i++) {
      ans += A[i].first;
    }
    return ans;
  }
};
```


## 三、统计频次阶梯子数组的数目 I


题意：给你一个整数数组 `nums`。  
考虑一个子数组中的所有不同值，并按它们首次出现的顺序排列。  
如果其中有 `k` 个不同值，且第一个不同值恰好出现一次，第二个不同值恰好出现两次，以此类推，第 `k` 个不同值恰好出现 `k` 次，则称该子数组为频次阶梯。  
返回 `nums` 中频次阶梯子数组的数量。  


数据范围：  
`1 <= nums.length <= 1500`  
`1 <= nums[i] <= 10^5`  


思路：枚举起点 + 最小堆  


**关键性质**  


先推导一个关键性质：含 `k` 个不同值的频次阶梯子数组，长度恰好为 `1 + 2 + ... + k = (1+k)*k/2`。  
所以从起点 `i` 出发，`k` 最多只有 `O(sqrt(n))` 个候选，总枚举量是 `O(n * sqrt(n))`。  


**首次出现的不同值**  


剩下的问题是如何快速按首次出现顺序取出不同值。  


经典转化：把「找下一个不同值」变成「找下一个值为 1 的位置」。  
对每个值，把它第一次出现的位置标记为 1，之后出现的位置标记为 0，得到一个 0/1 数组。  
显然，这个 0/1 数组里第 `t` 个 1，就是按首次出现顺序的第 `t` 个不同值。  


于是「按首次出现顺序枚举不同值」等价于「依次取出 1 的位置」，有两种实现方式。  
用线段树可以在 0/1 数组上二分查找下一个 1，复杂度 `O(log n * log n)`。  
更优的做法是把所有 1 的位置放进最小堆，堆顶就是最近的 1，弹出后下一个堆顶就是下一个不同值，复杂度 `O(log n)`。  


上面的 0/1 标记是从整个数组的视角定义的「首次出现」，而频次阶梯要统计的是以每个位置为起点的后缀子数组，起点一变，哪些位置算「首次出现」也会跟着变。  
如果每个起点都重新构建一次数据结构，代价太高，所以采用从左到右扫描、边枚举边更新的方式。  


**更新下个位置**  


每枚举完一个起点 `i`，位置 `i` 就不再是它对应值 `vi` 的第一次出现了，需要把 `vi` 的 1 标记从位置 `i` 转移到 `vi` 下一次出现的位置 `p`。  
这样当起点推进到 `i+1` 时，线段树或堆里的 1 标记恰好仍代表「以 `i+1` 为起点的首次出现位置」。  


要完成这个转移，必须能快速找到某个值的下一次出现位置，所以每个值都要维护一个有序的出现位置列表，从而可以快速找到下个位置。  


转移本身在两种数据结构上都是 `O(log n)`。  
线段树把位置 `i` 置 0、位置 `p` 置 1。  
最小堆则因为位置 `i` 恰好位于堆顶，直接弹出 `i` 再压入 `p` 即可。  


**恰好出现 k 次**  


拿到第 `k` 个不同值后，还要确认它在起点后是否出现 `k` 次，这同样用每个值的位置列表解决。  
若位置列表按升序存储，二分找到该值当前位置在列表中的下标，再判断「下标 + k」是否超过列表长度。  
超过说明总数不足 `k` 次，当前起点后面更大的 `k` 也不可能满足，提前结束。  
没超过则取出第 `k` 个位置，子数组的右边界 `R` 至少需要覆盖它。  


另一个思路是逆序存储位置列表，并随着起点右移及时清理小于起点的位置。  
这样位置列表最后一个就是首次出现的位置，从尾部数第 `k` 个元素就是该值的第 `k` 次出现，复杂度降到了 `O(1)`。  


**合法性判断**  


最后判定合法性：令右边界 `R` 为前 `k` 个不同值各自第 `k` 次出现位置的最大值。  
若 `R - L + 1 == (1+k)*k/2`，说明子数组长度恰好等于需求频次之和，而每个值的 `k` 次出现又都被 `R` 覆盖，所以不多不少，恰好构成频次阶梯。  


**为什么成立？**  


先看必要性：若子数组是频次阶梯，第 `j` 个出现值恰好出现 `j` 次，长度必然是 `1 + 2 + ... + k = (1+k)*k/2`，所以用长度相等来判不会漏掉合法答案。  

再看充分性：把前 `k` 个不同值按首次出现顺序记为 `v1, v2, ..., vk`。  
`R` 覆盖了每个 `vj` 的第 `j` 次出现位置，所以每个 `vj` 在 `[L, R]` 内至少出现 `j` 次，前 `k` 个值的出现次数之和至少是 `(1+k)*k/2`。  
若长度恰好等于 `(1+k)*k/2`，而整个子数组内所有值的出现次数总和（即长度）也正是这个值，两者只能严格相等：子数组内不能出现其他值，每个 `vj` 也不能超过 `j` 次。  


结合每个 `vj` 至少出现 `j` 次，恰好都是 `j` 次，子数组不多不少构成频次阶梯。  


复杂度：`O(n * sqrt(n) * log(n))`  


```cpp
typedef long long ll;
template <class T>
using min_queue = priority_queue<T, vector<T>, greater<T>>;

class Solution {
 public:
  int countStaircase(vector<int>& nums) {
    const int n = nums.size();
    unordered_map<ll, vector<ll>> valPos;
    min_queue<pair<ll, ll>> minHeap;
    for (int i = 0; i < n; i++) {
      valPos[nums[i]].push_back(i);
    }
    for (auto& [val, ps] : valPos) {
      std::reverse(ps.begin(), ps.end());
      minHeap.push({ps.back(), val});
    }
    ll ans = 0;
    vector<pair<ll, ll>> sta;
    sta.reserve(n);
    for (int i = 0; i < n; i++) {
      const ll v = nums[i];
      ll L = i, R = i;
      for (ll k = 1;; k++) {
        const ll expLen = (1 + k) * k / 2;
        if (i + expLen > n) {
          break;
        }
        if (minHeap.empty()) {
          break;
        }
        sta.push_back(minHeap.top());
        auto [pos, val] = minHeap.top();
        minHeap.pop();
        ll valCnt = valPos[val].size();
        if (valCnt < k) {
          break;
        }
        ll valLastPos = valPos[val][valCnt - k];
        R = max(R, valLastPos);
        if (expLen == (R - L + 1)) {
          ans++;
        }
      }
      while (!sta.empty()) {
        minHeap.push(sta.back());
        sta.pop_back();
      }
      minHeap.pop();
      valPos[v].pop_back();
      if (!valPos[v].empty()) {
        minHeap.push({valPos[v].back(), v});
      }
    }
    return ans;
  }
};
```


## 四、统计频次阶梯子数组的数目 II


题意：同第三题。  


数据范围：  
`1 <= nums.length <= 5 * 10^4`  
`1 <= nums[i] <= 10^5`  


思路：枚举起点 + 最小堆 + 右边界上限剪枝  


题目与第三题完全相同，只是数据范围更大，于是直接提交第三题的代码，结果在第 996 / 999 个测试用例上超时了。  


**为什么超时？**  


第三题的枚举框架是：对每个起点 `i`，从小到大枚举 `k`，终止条件只有两个：长度超出数组、或第 `k` 个不同值不足 `k` 次。  


但还少了一个终止条件的判断：当枚举到第 `k` 个不同值时，如果之前枚举到的某个不同值，出现次数已经超过自身的序号，那么后续更大的 `k` 也都是没有答案的，应该提前终止。  


原因在于第 `j` 个不同值必须恰好出现 `j` 次。 
一旦子数组右边界覆盖了它的第 `j+1` 次出现位置，它就出现至少 `j+1` 次，子数组必然不合法。  
而右边界 `R` 随 `k` 增大只会变大，所以这种情况一旦发生，更大的 `k` 也不可能合法。  


第三题代码没有这个判断，于是即使某个值早已超额、后续不可能再有答案，循环仍会继续枚举更大的 `k`，白白浪费轮次。  
最坏数据下，大多数起点都会把 `k` 枚举到接近 `O(sqrt(n))` 轮，每轮还带 `O(log n)` 的堆操作，总复杂度 `O(n * sqrt(n) * log(n))`。  
在 `n = 5 * 10^4` 时约 `1.8 * 10^8` 次操作，直接超时。  


**判断是否超过个数限制**  


先看朴素实现：每枚举到一个新的第 `k` 个不同值，就检查前面所有已枚举值是否「超额且被右边界覆盖」。  
每轮要检查 `k` 个值，复杂度 `O(k)`；把所有轮次加起来，每个起点是 `O(sqrt(n) * sqrt(n)) = O(n)`，总复杂度退化到 `O(n^2)`，不可行。  


优化的关键：终止条件「右边界覆盖了某个禁区」等价于「右边界大于等于所有禁区位置的最小值」。  
一旦 `R` 超过最小的禁区就必须终止。  
所以只需维护一个值：所有禁区位置的最小值 `limitPos`。  


复杂度不变，仍是 `O(n * sqrt(n) * log(n))`   


可以证明，很多子数组都会被这个剪枝减掉。  
所以实际枚举的子数组数量远小于 `O(n * sqrt(n))`。  


```cpp
typedef long long ll;
template <class T>
using min_queue = priority_queue<T, vector<T>, greater<T>>;

min_queue<pair<ll, ll>> minHeap;
vector<pair<ll, ll>> sta;

class Solution {
 public:
  int countStaircase(vector<int>& nums) {
    const int n = nums.size();
    unordered_map<ll, vector<ll>> valPos;
    while (!minHeap.empty()) {
      minHeap.pop();
    }
    for (int i = 0; i < n; i++) {
      valPos[nums[i]].push_back(i);
    }
    for (auto& [val, ps] : valPos) {
      std::reverse(ps.begin(), ps.end());
      minHeap.push({ps.back(), val});
    }
    ll ans = 0;
    sta.reserve(n);
    sta.clear();
    for (int i = 0; i < n; i++) {
      const ll v = nums[i];
      ll L = i, R = i;
      ll limitPos = n;
      for (ll k = 1;; k++) {
        const ll expLen = (1 + k) * k / 2;
        if (i + expLen > n) {
          break;
        }
        if (minHeap.empty()) {
          break;
        }
        sta.push_back(minHeap.top());
        auto [pos, val] = minHeap.top();
        minHeap.pop();
        ll valCnt = valPos[val].size();
        if (valCnt < k) {
          break;
        }
        ll valLastPos = valPos[val][valCnt - k];
        R = max(R, valLastPos);
        if (k < valCnt) {
          limitPos = min(limitPos, valPos[val][valCnt - k - 1]);
        }
        if (expLen == (R - L + 1)) {
          ans++;
        }
        if (R >= limitPos) {
          break;
        }
      }
      while (!sta.empty()) {
        minHeap.push(sta.back());
        sta.pop_back();
      }
      minHeap.pop();
      valPos[v].pop_back();
      if (!valPos[v].empty()) {
        minHeap.push({valPos[v].back(), v});
      }
    }
    return ans;
  }
};
```


## 五、最后


这周赛前两题比较简单。  


A 题模拟，计算两个数的二进制置位数后按题意比较即可。  
B 题贪心，每个元素重排一次的收益固定，选择收益最大的 k 个元素即可。  
C 题与 D 题是同一道题，核心是按首次出现顺序枚举不同值：位置列表逆序存储配合最小堆，利用长度恒等式 `(1+k)*k/2` 判断是否合法。  
D 题数据范围更大，在 C 题基础上加了一个「右边界上限」剪枝后通过。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
