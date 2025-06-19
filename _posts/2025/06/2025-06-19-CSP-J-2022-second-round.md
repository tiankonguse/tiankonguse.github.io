---
layout: post
title: CCF CSP-J 2022 编程算法比赛
description: 逻辑门语法树，有点难度          
keywords: 算法,CSP,算法比赛
tags: [算法, CSP, 算法比赛]
categories: [算法]
updateDate: 2025-06-19 12:13:00
published: true
---



## 零、背景


最近打算做一下 CSP-J 与 CSP-S 的比赛题，之前已经写了 4 场比赛的题解，今天来看看 2022 CSP-J 的题解吧。  


| 比赛 | 题目 |
| --- | --- |
| [CSP-J 2024](https://mp.weixin.qq.com/s/-07O9hiNL1e9llPDsaPoWQ) | A:扑克牌 入门  <br> B: 地图探险 普及−      <br> C: 小木棍 普及/提高−       <br> D: 接龙 提高+/省选− <br>	[题解](https://mp.weixin.qq.com/s/-07O9hiNL1e9llPDsaPoWQ) |
| [CSP-S 2024](https://mp.weixin.qq.com/s/MVvztSH8LW13eP5lc7cHjg) | A:决斗 普及−   <br> B: 超速检测 普及+/提高 <br> C: 染色 提高+/省选−        <br> D: 擂台游戏 NOI/NOI+/CTSC	<br> [题解](https://mp.weixin.qq.com/s/MVvztSH8LW13eP5lc7cHjg) |
| [CSP-J 2023](https://mp.weixin.qq.com/s/-RalfMmoFQLGlP9AD5VCAA) | A:小苹果 普及− <br> B: 公路 普及−         <br> C: 一元二次方程 普及/提高−  <br> D: 旅游巴士 普及+/提高 <br> [题解](https://mp.weixin.qq.com/s/-RalfMmoFQLGlP9AD5VCAA) |
| [CSP-S 2023](https://mp.weixin.qq.com/s/BEsjZsgI-RhVGbWyeVgHUw) | A:密码锁 普及− <br> B: 消消乐 提高+/省选−  <br> C: 结构体 提高+/省选−      <br> D: 种树 提高+/省选− <br> [题解](https://mp.weixin.qq.com/s/BEsjZsgI-RhVGbWyeVgHUw) |
| CSP-J 2022                                                      | A:乘方 入门    <br> B: 解密 普及−         <br> C: 逻辑表达式 普及+/提高    <br> D: 上升点列 普及/提高− <br> |



A: 快速幂  
B: 二分  
C: 模拟+语法树
D: 动态规划  


代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/other/CSP-J/  


![](https://res2025.tiankonguse.com/images/2025/06/19/001.png)  

## 一、乘方（pow）


![](https://res2025.tiankonguse.com/images/2025/06/19/002.png)  


题意：求`a^b`的值，如果大于`10^9`，输出 -1。  


思路：快速幂  


利用快速幂计算 `a^b`，如果大于 `10^9`，就快速返回 `-1`。  


```cpp
const ll kMaxVal = 1e9;
ll qpow(ll x, ll v) {
  ll y = 1;
  while (v) {
    if (x > kMaxVal) return -1; 
    if (v & 1) y = y * x;
    if (y > kMaxVal) return -1;
    v >>= 1;
    x = x * x;
  }
  return y;
}
```


## 二、解密（decode）


![](https://res2025.tiankonguse.com/images/2025/06/19/003.png) 


题意：给三个整数 n、e、d，求两个正整数 p 与 q，使 `n = p * q` 且 `e * d = (p - 1) * (q - 1) + 1`。  


思路：二分+数学公式  


结合两个公式，可以推导出 `m = p + q = n - e * d + 2`。  


令`y = p * q`，则可以得到方程 `y = p * (m - p)`。  
显然，这个方程有两个解，一个是 0，一个是 m。  


抛物线方向朝下，对称轴 `m/2`是最大值，在 `[0,m/2]`是递增，在`[m/2,m]`是递减。  
如果最大值小于 n，显然没有答案，否则有答案。  


题目要求 q 小于 p，显然，q 的答案范围在 `(0,m/2]`。  
可以二分 q，来看是否存在整数答案。  


注意事项：数据范围很大，计算可能越界，这里使用 `int128`来存储结果。  


```cpp
bool Check() {
  const int128 m = n - e * d + 2;
  if (m < 2) return false;  // 无解
  // 最大值 k = m/2
  int128 l = 1, r = m / 2;
  while (l < r) {
    int128 mid = (l + r) / 2;
    int128 Y = mid * (m - mid);
    if (n <= Y) {
      r = mid;
    } else if (n > Y) {
      l = mid + 1;
    }
  }
  if (r * (m - r) == n) {
    p = r;
    q = m - p;
    return true;
  }
  return false;
}
```

## 三、逻辑表达式（expr） 


![](https://res2025.tiankonguse.com/images/2025/06/19/004.png)   


题意：给一个带括号的与或表达式，问最终结果。  
另外与或表达式有开关短路功能，即对于与逻辑，前面是 0 时，后面的不需要计算了；对于或逻辑，前面的是 1 时，后面的也不需要计算了。  


思路：模拟+语法树  


具体分两个步骤：  
1）语法解析表达式，使用一个语法树储存。  
2）按题意计算，并统计与或开关的个数。  


分析表达式的语法树，需要三个节点：0/1原子节点，与表达式节点、或表达式节点。  


```cpp
enum { E_NUM = 0, E_AND, E_OR };

struct Node {
  int ans = 0;
  int type = 0;
  vector<int> childs;
};
```


由于与的优先级大于或，整个表达式可以抽象为是若干节点的或运算。  



```cpp
// node1 | node2 | node3 | ...
int ParseOr(int& pos) {
  const int orIndex = NewNode(E_OR);
  nodes[orIndex].childs.push_back(ParseAnd(pos));
  while (str[pos] == '|') {
    pos++;
    nodes[orIndex].childs.push_back(ParseAnd(pos));
  }
  return orIndex;
}
```


其中 node1、node2、node3都是一个与表达式。  
对于与表达式的节点列表，抽象为一个表达式块。  


```cpp
// node4 & node5 & node6 & ...
int ParseAnd(int& pos) {
  const int andIndex = NewNode(E_AND);
  nodes[andIndex].childs.push_back(ParseBlock(pos));
  while (str[pos] == '&') {
    pos++;
    nodes[andIndex].childs.push_back(ParseBlock(pos));
  }
  return andIndex;
}
```

显然，node4、node5、node6 要么是 0 或 1 原子节点，要么是带括号的表达式。  


```cpp
// 0、1、()
inline int ParseBlock(int& pos) {
  if (str[pos] == '(') {
    return ParseParentheses(pos);
  } else {
    return ParseNum(pos);
  }
}
```


对于括号表达式，可以将其视为一个独立的表达式，即或表达式。  


```cpp
inline int ParseParentheses(int& pos) {
  assert(str[pos] == '(');
  pos++;  // skip (
  int parenthesesIndex =  ParseOr(pos);
  assert(str[pos]== ')');
  pos++;  // skip )
  return parenthesesIndex;
}
```


由此，通过4个函数完成语法树解析。  


解析完语法树后，递归计算答案即可。  

注意事项：根据样例1可以发现，对于`node1 | node2 | node3 | ...`，如果 node1 为 true 时，短路次数并不是1，而是其他儿子的个数。  



```cpp
int andSkipNum = 0, orSkipNum = 0;
int RunHead(int head) {
  Node& node = nodes[head];
  if (node.type == E_NUM) {
    return node.ans;
  }
  int ans = RunHead(node.childs[0]);
  const int childNum = node.childs.size();
  for (int i = 1; i < childNum; i++) {
    if (node.type == E_AND && ans == 0) {
      andSkipNum += childNum - i;
      break;
    } else if (node.type == E_OR && ans == 1) {
      orSkipNum += childNum - i;
      break;
    } else {
      ans = RunHead(node.childs[i]);
    }
  }
  node.ans = ans;
  return ans;
}
```


## 四、上升点列（point）


![](https://res2025.tiankonguse.com/images/2025/06/19/005.png)   


题意：给定 n 个点的坐标，可以再插入 k 个点，问最终最多能选出多少个点，组成一个非递减序列，且相邻点的欧几里得距离为 1。  


思路：动态规划  


假设最终答案是从 n 个点中选择了 a 个点，并插入了 b 个点。  
显然，a 个点需要满足非递减的性质，因此需要对 n 个点整体排序。  
如果 b 个点小于 k，显然可以把剩余的插入点也用上，从而组成更长的序列，因此 k 个插入点需要全部用完。  


状态定义：`f(i, k)` 表示前 i 个点，最多插入 k 个点时能得到的最长非递减序列长度。  


状态转移方程：枚举下一个选择的点，不满足距离为 1 时，通过插入点来连接，取最优解。  


```cpp
f(i,k) = max(f(j,leftK) + dis(j,i))  
leftK = k - dis(j,i) + 1
```


完整代码如下，三层循环即可。  


```cpp
sort(nums.begin() + 1, nums.end());
memset(dp, 0, sizeof(dp));
int ans = 0;
for (int i = 1; i <= n; i++) {
  for (int k = 0; k <= K; k++) {
    dp[i][k] = 1 + k;              // 1个输入点 + k 个自由点
    for (int j = 1; j < i; j++) {  // 尝试连接 j -> i
      if (!Less(nums[j], nums[i])) continue;
      const int d = Dis(nums[j], nums[i]);
      const int useK = d - 1;
      if (k < useK) continue;  // 自由点不够
      dp[i][k] = max(dp[i][k], dp[j][k - useK] + d);
    }
    ans = max(ans, dp[i][k]);
  }
}
```

## 五、最后  


这次比赛其实有点难度。  


第一题快速幂，比较简单。  
第二题解方程或者二分，难度还好。  
第三题表达式语法树，其实比较难的。  
第四题是简单的动态规划。  




《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
