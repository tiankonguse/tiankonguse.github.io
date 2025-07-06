---
layout: post
title: leetcode 第 457 场算法比赛-比较简单
description: 忘记定闹钟了  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-07-06 12:13:00
published: true
---

## 零、背景


上周回老家了一趟，临时把闹钟关闭了。  
昨晚忘记打开闹钟了，一觉睡到了十一点多，起床后去买早餐，回来的时候就十二点结束比赛了。  
中午吃完早餐，看了下四道题，都不难。  


A: 排序    
B: 并查集  
C: 并查集    
D: 贪心反推    


排名：无  
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、优惠券校验器  


![](https://res2025.tiankonguse.com/images/2025/07/06/001.png)  


题意：给一些优惠券，判断是否合法，最后按规则输出合法的优惠券。  
合法条件：标识符合法、业务类别合法、当前有效。  
输出规则：优先按业务类别，其次按标识符字典序。  


思路：按顺序判断是否合法，然后按输出规则排序。  


## 二、电网维护  


![](https://res2025.tiankonguse.com/images/2025/07/06/002.png)  


题意：给一个无向图，然后若干操作和询问。  
操作：一个顶点进行标记。  
询问：顶点是否被标记，如果被标记，则返回连通图中尚未标记的最小顶点。  



思路：并查集。  


通过并查集对所有顶点进行联通分支的分组，根节点当做分组的编号，每个分组维护一个未标记的最小堆集合。  


```cpp
dsu.Init(c + 1);
for (auto& connection : connections) {
  int u = connection[0];
  int v = connection[1];
  dsu.Union(u, v);
}
unordered_map<int, set<int>> H;
for (int i = 1; i <= c; i++) {
  int p = dsu.Find(i);
  H[p].insert(i);
}
```


操作时，对顶点进行标记。  
询问时：优先判断顶点是否标记。  
如果已标记，则预处理最小堆，把已标记的堆顶删除，剩余的堆顶就是答案。  


```cpp
int t = q[0], x = q[1];
int p = dsu.Find(x);
auto& HP = H[p];
if (t == 1) {
  if (HP.empty()) {
    ans.push_back(-1);
  } else if (HP.count(x)) {
    ans.push_back(x);
  } else {
    ans.push_back(*HP.begin());
  }
} else {
  HP.erase(x);
}
```



PS：这里我使用 set 来模拟最小堆，这样就可以直接删除已标记的元素了。  


复杂度：`O(n log(n))`  


优化：进行分组的时候，其实我们已经知道顶点之间的顺序了，所以可以直接使用数组来储存。  


```cpp
vector<vector<int>> H(c + 1);
for (int i = 1; i <= c; i++) {
  int p = dsu.Find(i);
  H[p].push_back(i);
}
for (int i = 1; i <= c; i++) {
  std::reverse(H[i].begin(), H[i].end());
}
```


数组翻转后，数组是逆序递降的。  
进行询问时，只需要判断数组最后一个元素即可。  



```cpp
vector<int> flag(c + 1, 0);
int t = q[0], x = q[1];
int p = dsu.Find(x);
auto& HP = H[p];
if (t == 1) {
  if (flag[x] == 0) {
    ans.push_back(x);
  } else {
    while (!HP.empty() && flag[HP.back()]) {
      HP.pop_back();
    }
    if (HP.empty()) {
      ans.push_back(-1);
    } else {
      ans.push_back(HP.back());
    }
  }
} else {
  flag[x] = 1;
}
```


## 三、包含 K 个连通分量需要的最小时间  


![](https://res2025.tiankonguse.com/images/2025/07/06/003.png)  


题意：给n个顶点和m条边，每个边有一个删除时间，问哪个时刻期，图的联通分支至少有 k 个。  


思路：并查集。  


所有边按时间排序，然后时间从大到小一条条把边加回来，看什么时候不满足要求。  


```cpp
sort(edges.begin(), edges.end(), [](const auto& a, const auto& b) { return a[2] > b[2]; });
// 时间逆序判断
dsu.Init(n);
for (auto& e : edges) {
  int u = e[0], v = e[1], t = e[2];
  dsu.Union(u, v);
  if (dsu.Block() < k) {
    return t;
  }
}
return 0;
```

注意事项，某条边加回来首次不满足时，这个时刻就是答案。  
因为正序来看，就是这个时刻删除边，即是首次满足的时刻。  


## 四、到达目标点的最小移动次数  


![](https://res2025.tiankonguse.com/images/2025/07/06/004.png)  


题意：对于一个坐标`(x,y)`，令最大值为`m=max(x,y)`，则可以得到新的坐标 `(x+m,y)`和`(x,y+m)`。  
问一个坐标通过最少多少步，可以到达另外一个坐标。  


分析：贪心反推  


正向看，有两种选择。  
逆向来看，其实只有一个选择。  
即要么有答案，要么是固定的步数。  


具体分析如下。  
对于一个坐标，不妨假设 `x<y`，则可以得到 `(x+y, y)` 和`(x,2y)`。  
显然，加法在哪里，哪里就会更大。  


如果是 `x+y`，则 `(x+y)/y < 2`。  
如果是 `2y`，则 `2y/x > 2`。  


换言之，如果一个坐标 `(X, Y)` 满足 `Y > 2X`， 那么一定是从 `(Y/2, X)`转换得到的。  
反之，如果不满足，则是从 `(Y-X, X)`得到的。  


故可以根据坐标的比例与2的关系，来逆向递推逼近初始坐标。  
考虑到对称性，可以对坐标进行交换，保证 `tx>=ty`。  


```cpp
if (tx < ty) {
  swap(tx, ty);
  swap(sx, sy);
}
if (tx >= ty * 2) {
  if (tx % 2 == 1) return -1;
  tx /= 2;
} else {
  tx -= ty;
}
ans++;
```


注意事项：如果 `X==Y`时，两个都可以选择。  
故需要使用一个标记，如果存在相等的情况，则允许坐标交叉相等的情况。  


```cpp
if (tx == ty) eqFlag = true;
if (tx == sx && sy == ty) return ans;
if (eqFlag && tx == sy && ty == sx) return ans;
```


## 五、最后


这次比赛题目都不难，不过最后一题有一个注意事项，不注意的话就会翻车。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
