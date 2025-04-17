---
layout: post
title: leetcode 第 445 场算法比赛 - 组合数学
description: 大意了，第三题卡住了  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateData: 2025-04-13 12:13:00
published: true
---

## 零、背景

这次比赛第三题比较难，我有想法，但是被卡时间了，最后没做出进来。  

A: 签到题  
B: 贪心  
C: 组合数学  
D: 数位DP  


排名：200+  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、找到最近的人  


题意：数轴上给三个点 A、B、C，问A 和 B 谁距离 C 更近。  


思路：比赛出这道题，不知道 leetcode 怎么样想的。  


## 二、最小回文排列 I  


题意：给一个回文串，可以对这个串重新排列，问字典序最小的回文串。  


思路：贪心。  


显然，最小的回文串是将所有的字母按字典序排列，然后对称。  
故，我们只需要统计每个字母的出现次数，然后将出现次数为奇数的字母放在中间，剩余的字符个数初二，按字典序排列即可得到左半部，右半部对称即可。  


## 三、最小回文排列 II



题意：给一个回文串，可以对这个串重新排列，问字典序最K小的回文串。  


思路：组合数学。  


方法1：大整数  


首先和第二题一样，去掉一个奇数的中间字符，剩余字符数量折半，问题就转化为了求字典序第K小的排列。  


针对这个问题，我们需要先能够求出一个字符串的总排列数。  
预处理统计每个字符个数后，公式如下：  


$$ 
permutation(n) = \frac{n!}{a1! * a2! * ... * ak!} 
$$


其中 n 是字符串的长度，a1、a2、...、ak 是每个字母的出现次数。  
如果 `permutation(n)<k`，说明没有答案。  


```python
MAX = 10005
factorial = [1] * MAX
for i in range(1, MAX):
    factorial[i] = factorial[i - 1] * i

def count_permutations(freq_tuple):
    total = sum(freq_tuple)
    res = factorial[total]
    for f in freq_tuple:
        res //= factorial[f]
    return res
```


之后，我们就可以从前到后枚举每个字符，找到答案。  


假设第一个位置是字符 'a'，我们计算剩余字符的排列数 `next_permutation`。  
如果 `next_permutation >= k`，说明第一个字符答案为 'a'，我们把 'a' 放在第一个位置。  
如果 `next_permutation < k`，我们就需要继续枚举下一个字符， 此时需要将 k 减去前缀字符 'a'的所有排列数 `k -= next_permutation`。  
这样，每个位置总能找到一个字符，满足`next_permutation >= k`。  


选择一个字符，怎么求剩余字符的排列数呢？  
与默认方案一样，直接套上面的公式。  


这里可以预处理下每个数字的阶乘，则可以在 `O(26)`内计算出排列数。  
综合复杂度：`O(n * 26^2)`  


由于 K 不大于 `10^6`，前面大部分字符第一个字符就满足`next_permutation >= k`，故实际复杂度不会很大。  


我使用 python 实现了上面的这个代码，最终超时了。  


```python
def kth_smallest_permutation(s, k):
    counter = Counter(s)
    chars = sorted(counter.keys())
    freq_tuple = tuple(counter[c] for c in chars)
    total_possible = count_permutations(freq_tuple)
    if k > total_possible:
        return ""  # 所有合法排列数不足 k 个

    result = []
    while len(result) < len(s):
        for ch in chars:
            if counter[ch] == 0:
                continue
            counter[ch] -= 1
            freq_tuple = tuple(counter[c] for c in chars)
            cnt = count_permutations(freq_tuple)
            if k <= cnt:
                result.append(ch)
                break
            else:
                k -= cnt
                counter[ch] += 1
        else:
            return ""  # 无法构造出合法解

    return ''.join(result)
```


优化：选择一个字符后，可以通过组合公式直接计算出剩余字符的排列数。  


假设选择的是字符 'a'，我们可以对比选择前后的两个公式  


选择后如下：  


$$
permutation(n-1) = \frac{(n-1)!}{(a1-1)! * a2! * ... * ak!}
$$


分子少了一个 n，分母少了一个 a1，故可以得到如下的公式。  


$$
permutation(n) = \frac{n * permutation(n-1)}{a1}
$$


现在是求`permutation(n-1)`，我们可以将上面的公式变形为：  


$$
permutation(n-1) = \frac{a1 * permutation(n)}{n}
$$


就这样，我们通过`O(1`的时间复杂度，计算出剩余字符的排列数。  
综合复杂度：`O(n)`  


```python
result = []
for _ in range(n):
    for ch in chars:
        if counter[ch] == 0:
            continue
        
        total_possible_with_char = total_possible * counter[ch] // current_len
        if k <= total_possible_with_char: # 选择
            counter[ch] -= 1
            current_len -= 1
            total_possible = total_possible_with_char
            result.append(ch)
            break
        else:
            k -= total_possible_with_char # 不选择
```


小技巧：注意，`a1/n`显然无法整除，我们先计算`a1 * permutation(n)`，然后再除以 n，就可以整除了。  
这是一个很有用的技巧，后面要考。  


方法2：剪枝  


由于 K 只有 `10^6`，当我们确定排列数大于 K 时，我们可以直接剪枝停止计算，返回结果是大于 K 的标记即可。  


这时候就不能使用排列的思路了，需要把排列问题转化为组合问题。  


$$
permutation(n) = C(n, a1) * C(n-a1, a2) * ... * C(n-a1-a2-..., ak)
$$



现在把排列问题转化为了组合 `C(n,m)` 问题。  


```cpp
ll CC(int n) {
  ll res = 1;
  for (auto [k, v] : freq) {
    res *= C(n, v);
    if (res >= kMaxK) return kMaxK;
    n -= v;
  }
  return res;
}
```


组合数也是一样，需要进行剪枝。  
组合数先展开一下如下：  


$$
C(n,m) = \frac{n * (n-1) * ... * (n-m+1)}{m * (m-1) * ... * 1}
$$


很容易想到，如果下面每一项可以整除的化，就可以循环计算了。  


第一种是最大值互相组合。  


$$
C(n,m) = \frac{n}{m} * \frac{n-1}{m-1} * ... * \frac{n-m+1}{1}
$$



这里有一个问题，怎么证明每一项是可以整除的呢？  


还记得方法1里面的小技巧吗？  
每一项自身无法保证整除，但是和其他项组合，就可以保证整除了。  


所以可以对公式转化一下，如下：  


$$
C(n,m) = \frac{n}{m} * \frac{n-1}{m-1} * ... * \frac{n-m+1}{1} = \frac{n}{m} * C(n-1, m-1)
$$


神奇，我们如果计算出 `C(n-1,m-1)`，就可以计算出 `C(n,m)` 了，复杂度`O(m)`。  


```cpp
ll C(int n, int m) {
  m = min(m, n - m);
  ll res = 1;
  for (int i = 1; i <= m; ++i) {
    res = res * (n - m + i) / i;
    if (res >= kMaxK) return kMaxK;
  }
  return res;
}
```

第二种思路是最大值与最小值组合。  


$$
C(n,m) = \frac{n}{1} * \frac{n-1}{2} * ... * \frac{n-m+1}{m}
$$


同样可以转化一下，如下：  


$$
C(n,m) = \frac{n}{1} * \frac{n-1}{2} * ... * \frac{n-m+1}{m} = \frac{n-m+1}{m} * C(n, m-1)
$$


同这个公式，我们也可以通过`O(m)`的复杂度计算出 `C(n,m)`了。  


```cpp
ll C2(int n, int m) {
  m = min(m, n - m);
  ll res = 1;
  for (int i = 1; i <= m; ++i) {
    res = res * (n - i + 1) / i;
    if (res >= kMaxK) return kMaxK;
  }
  return res;
}
```


有了上面的组合数学公式，我们就可以做这道题了。  


回到原先的排列数  


$$
permutation(n) = C(n, a1) * C(n-a1, a2) * ... * C(n-a1-a2-...-ak, ak)
$$


计算排列数的复杂度就是 `O(a1)+O(a2)+...+O(ak)`，也就是 `O(n)`。  
综合复杂度就是 `O(n^2)`  


```cpp
ll total = CC(n);  // 之前已经计算的排列数
if (total < k) {
  return;  // 不足 k 个
}
const int nn = n;
for (int i = 0; i < nn; i++) {
  for (auto &[ch, count] : freq) {
    if (count == 0) continue;
    count--;
    n--;
    ll permutations = CC(n);  // 剩余字符的排列数;
    if (k <= permutations) {
      halfAns.push_back(ch);
      break;
    } else {
      count++;
      n++;
      k -= permutations;
    }
  }
}
```


是的，你没看错，这个复杂度不会超时。  
因为 k 很小，大概证明如下：  


假设字符只有1个，`10!=3,628,800`，就超过了 `10^6`。  
也就是枚举的字符个数不会超时 10 个。  


如果 n 很大，比如 `n=100`，前面出现的字符都是 1 个，则只需要枚举 3 个字符就超过了 `10^6`。  
如果 n 是 `10000`，枚举 2 个字符就超过了 `10^6`。  


在 n 很大时，枚举 2 个字符就可以确定超过 `10^6`。   
在 n 降低时，枚举的字符在增加，到 100 也才 3 个字符。  
所以实际复杂度不会很大。   


## 四、统计逐位非递减的整数  


题意：给一个10进制大整数区间，问转化为 B 进制后，逐位非递减的整数有多少个。  


思路：典型的数位DP。  


第一步：大整数进制转换。  


类似于 10 进制转化 2 进制，通过不断除以2并记录余数，最后将余数反向排列即可。    


例如 43，不断除2得到商和余数，余数就是二进制的低位，商大于0就继续除。  



```text
43 -> 21 -> 10 -> 5 -> 2 -> 1 -> 0
      1      1    0    1    0    1
```

代码如下：  


```cpp
string TransToB(string& s, int b) {
  string res = "";
  while (!IsZero(s)) {
    string quotient;
    int pre = 0;
    for (auto c : s) {
      int cur = pre * 10 + (c - '0');
      quotient.push_back('0' + (cur / b));
      pre = cur % b;
    }
    res.push_back('0' + pre);
    s.swap(quotient);
  }
  while (res.size() >= 2 && res.back() == '0') {
    res.pop_back();
  }
  reverse(res.begin(), res.end());
  return res;
}
```


第二步：数位DP。  


这里可以通过前缀差数位DP，也可以使用区间数位DP。  


区间数位DP 是直接求区间 `[l,r]` 的答案。  
前缀差数位DP状态定义：`f(n)` 表示 `[0,n]` 的所有非递减数的个数，然后 `f(r)-f(l-1)`得出答案。  


前缀差数位DP 之前介绍过无数次了，需要定义两个状态转移方程：  
带边界状态：`f(pos, pre)` 处理到第 pos 位前一个字符是 pre 且需要考虑边界的个数。  
不带边界状态：`F(pos, pre)` 处理到第 pos 位前一个字符是 pre 且不考虑边界的个数。  


带边界的状态转移方程：  


```cpp
f(pos, pre) = sum(F(pos+1, c)) + f(pos, C)  
```

其中 `F(pos+1, c)` 代表当前选择的值小于边界且大于等于 pre 的情况，之后的值可以任意选，只需要保持非递减即可。  
而`f(pos, C)`是选择边界且边界大于等于 pre 的情况。  


不带边界的状态转移方程更简单：  


```cpp
F(pos, pre) = sum(F(pos+1, c))
```


含义是选择所有大于等于 pre 的字符。  


带边界的动态规划比较复杂，这里暂时不展开介绍了，后面我找到简单的写法后，再来介绍。  


## 五、最后  


这次比赛第三题涉及组合数学知识，我比赛期间只推导出了最简单的公式，然后使用 python 暴力计算，最后超时了。  
赛后看了前两名的代码，一个使用 python 实现的，一个使用 cpp 实现的，对应上面的两个方法。  


cpp 实现时，我独立推导出的公式和参考的代码公式不同。  
于是自己去推导了很久，结果发现两个公式确实都是正确的。    


$$
C(n,m)  = \frac{n}{m} * C(n-1, m-1) = \frac{n-m+1}{m} * C(n, m-1)
$$


一个是 `res = res * (n - m + i) / i;`。  
另一个是 `res = res * (n - i + 1) / i;`，  
竟然都正确，很神奇。  


整理一下，组合公式如下：


$$ (1): permutation(n) = \frac{n!}{a1! * a2! * ... * ak!} $$
$$ (2): permutation(n-1) = \frac{a1 * permutation(n)}{n} $$
$$ (3): C(n,m) = \frac{n * (n-1) * ... * (n-m+1)}{m * (m-1) * ... * 1} $$
$$ (4): C(n,m)  = \frac{n}{m} * C(n-1, m-1)  $$
$$ (5): C(n,m)   = \frac{n-m+1}{m} * C(n, m-1) $$



《完》

-EOF-

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
