---
layout: post
title: CSP-J/S 总结之数学（1）
description: 素数判定、素数表、质因数分解、约数、GCD、逆元、取模
keywords: 算法,CSP,算法比赛
tags: [算法, CSP, 算法比赛]
categories: [算法]
updateDate: 2025-10-27 20:13:00
published: true
---



## 零、背景


CSP-J/S 是从 2019 年开始举办的。  


之前已经在《[近 6 年 CSP-J 算法题型分析](https://mp.weixin.qq.com/s/MkE5yfMLioAxGtiFKz1-cg)》和《[历年 CSP-S 算法题型分析](https://mp.weixin.qq.com/s/meOv7fuSQaXEYU3mlOdb8w)》两篇文章里总结了 CSP-J 和 CSP-S 的题型。  


接下来我的规划分两部分：  


**第一部分**：介绍常见算法如何实现，以及在历年真题中是如何应用的。  
**第二部分**：介绍面对比赛时，使用什么样的策略，才能尽可能拿到更高的分数。  


第一部分已经分享了[二分](https://mp.weixin.qq.com/s/Wi8Bb1fAvQ7BEAwSUZXLdw)、[线段树](https://mp.weixin.qq.com/s/KKgBp_AhWvoKS_wVoKX_Rg)、[状态最短路](https://mp.weixin.qq.com/s/bU5DlFIjXsJiJkNekr6Efg)、[动态规划](https://mp.weixin.qq.com/s/73dXl-dP2LcaYpd7j-0-wg)。  
第二部分已经分享了[得分技巧](https://mp.weixin.qq.com/s/6RIMRGRTvcZujhSJzlHfjQ)、[环境准备](https://mp.weixin.qq.com/s/2CJBXOxT5lXoN_jNqDhaKQ)。  



这篇文章属于第一部分第五篇，打算介绍一下比赛可能涉及的数学知识。 


**阅读提示与约定**  

- 代码为 C++ 示例（默认 C++17），文中 ll 表示 long long。  
- MOD 表示取模数；涉及除法/逆元时，需保证参与元素与 MOD 互质；若使用费马小定理，需 MOD 为质数。  
- 使用素数表前请先调用 InitPrimes() 进行预处理。  
- 示例常量 N=1e6 仅作演示，可按题目规模调整。  


## 一、大纲  


CSP-J（入门组）要求基础数学工具的应用，侧重于小学至初中数学基础，强调实际编程中的数学工具应用。  
例如：进制转换、高精度加减乘除、解方程、初等数论、排列与组合等。  


典型应用场景如下：  


- 高精度加减乘除（无除法优化）  
- 暴力枚举中的数学验证（如质数判断）  
- 简单组合问题（如杨辉三角求路径数）  



CSP-S（提高组）需深入数学建模与理论分析。  
例如：同余式与模运算、欧拉定理、费马小定理、扩展欧几里得算法、中国剩余定理、多重集合与排列组合、容斥原理、矩阵基本运算、高斯消元解线性方程组、条件概率、简单博弈等。  


典型应用场景如下：  


- 数论优化算法（模逆元加速模运算）  
- 矩阵快速幂求解线性递推（如斐波那契）  
- 高斯消元解异或方程组（图论建模）  
- 组合数学优化动态规划状态转移  


很多知识比较复杂，如果你之前不了解这些，临近比赛时临时学习收益率不大。  
所以我打算整理一些简单的数学知识，方便大家复习。  



## 二、素数  


素数的题目，一般涉及到素数判定、质因数分解、约数枚举等，下面分别来介绍一下。  



**素数表**  


素数的各种问题，一般都需要使用素数表来加速，所以这里先来介绍一下素数表打表。  


为了简单方便，一般使用埃氏筛法，即找到下一个素数，并标记素数的所有倍数为合数。  


```cpp
// 埃氏筛求 N 范围内的所有质数
// O(n log log n)
const int N = 1000000;
const int M = 78499;
bool is[N];
int prm[M];
int prmCnt = 0;
int InitPrimes() {
  if (prmCnt > 0) return prmCnt;
  int e = (int)(sqrt(0.0 + N) + 1), k = 0, i;
  memset(is, 1, sizeof(is));
  prm[k++] = 2;
  is[0] = is[1] = 0;
  for (i = 4; i < N; i += 2) is[i] = 0;
  for (i = 3; i < e; i += 2) {
    if (is[i]) {
      prm[k++] = i;
      for (int j = i * i; j < N; j += i * 2) {
        is[j] = 0;
      }
    }
  }
  for (; i < N; i += 2) {
    if (is[i]) {
      prm[k++] = i;
    }
  }
  return prmCnt = k;
}
```


**素数判定**  


有时候只是临时来进行素数判定，可以直接使用 `O(sqrt(n))`的方法来暴力判断。  


```cpp
// 判断一个数是否为质数
// 时间复杂度 O(sqrt(n))
bool IsPrime2(int n) {
  for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) {
      return false;
    }
  }
  return n >= 2;  // 1 不是质数, 2和3是质数
}
```


当然，如果涉及频繁的素数判定，则可以预处理素数表，然后加速筛选。  
由于快速跳过了合数，性能提升了 `log` 倍。  


```cpp
// 利用素数表，判断 n 是否为质数
// 时间复杂度 O(pi(sqrt(n)))，pi(x) 为不超过 x 的质数个数
// 大概复杂度为 O(sqrt(n)/log(sqrt(n)))
bool IsPrime(long long n) {
  if (prmCnt == 0) InitPrimes(); // 确保已初始化素数表
  if (n < N) {
    return is[n];
  }
  for (int i = 0; i < prmCnt; i++) {
    long long p = prm[i];
    if (p * p > n) {
      break;
    }
    if (n % p == 0) {
      return false;
    }
  }
  return true;
}
```


**质因数分解**  


有些题目需要求出质因数，与素数判定一样，可以暴力来算，也可以使用素数表来加速。  


```cpp
// 质因数分解
// 复杂度： O(sqrt(n))
std::vector<std::pair<int, int>> PrimeFactorization(int n) {
  std::vector<std::pair<int, int>> factors;
  for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) {
      int count = 0;
      while (n % i == 0) {
        n /= i;
        count++;
      }
      factors.emplace_back(i, count);
    }
  }
  if (n > 1) {
    factors.emplace_back(n, 1);
  }
  return factors;
}
```



**约数**  



还有些场景需要求出所有的约数，这里就只能暴力求解了。  


```cpp
// 计算 n 的所有约数
// 复杂度： O(sqrt(n))
std::vector<int> GetAllDivisors(int n) {
  std::vector<int> divisors;
  for (int i = 1; i * i <= n; i++) {
    if (n % i == 0) {
      divisors.push_back(i);
      if (i != n / i) {
        divisors.push_back(n / i);
      }
    }
  }
  std::sort(divisors.begin(), divisors.end());
  return divisors;
}
```


## 三、最大公约数  


最大公约数也是很常见的题目，一般通过辗转相除法来计算。  


```cpp
// 辗转相除法
// 复杂度 O(log(min(a,b)))
ll gcd(ll a, ll b) {
  while (a != 0) {
    ll tmp = a;
    a = b % a;
    b = tmp;
  }
  return b;
}
```


有了最大公约数，就可以快速计算出最小公倍数。  


```cpp
// 推荐先除后乘，尽量避免溢出
ll lcm(ll a, ll b) {  //
  return a / gcd(a, b) * b;
}
```


## 四、模运算、快速幂、逆元  


模运算有一些很有意思的性质。  


**加法**  


加法与取模可先取后算，结果等价：  



```cpp
(a % MOD + b % MOD) % MOD = (a + b) % MOD
```

**减法**  


减法可能得到负数，所以一般需要通过取模映射到非负数区间 `[0, mod)`  



```cpp
((a - b) % MOD + MOD) % MOD
```


解释：  

1）`a - b` 可能会得到一个很大的负数  
2）`(a - b) % MOD` 得到的整数范围是 `(-mod, mod)`。  
3）再加上 `MOD` 即可把数据范围映射到非负数  
4）最后取模，就得到 `[0, mod)`范围的结果。  

 
**乘法**  


乘法为了防止溢出，一般需要先取模，再相乘。  
原理和加法类似，先把数据范围映射较小的范围，再进行乘法运算，避免溢出。  


```cpp
(a * b) % MOD = ((a % MOD) * (b % MOD)) % MOD
```


**快速幂**  


快速幂是指快速求出 `a^b % C`的值，其中 b 一般非常大，无法循环来算。  


基本思想是利用二进制拆分指数，将指数 b 拆分为若干个 2 的幂次方的和，从而将计算复杂度从 `O(b)` 降低到 `O(log b)`。  



```cpp
// 快速幂
ll qpow(ll x, ll v, ll mod) {
  x = x % mod;
  ll y = 1;
  while (v) {
    if (v & 1) y = y * x % mod;
    x = x * x % mod;
    v >>= 1;
  }
  return y;
}
```




**逆元**  


取模也可以进行除法运算，不过需要用到逆元。  


前提：模数 mod 为质数且 gcd(a, mod) = 1；若 mod 非质数，可在 gcd(a, mod) = 1 时使用扩展欧几里得算法求逆。  


在模 `p` 下，`a` 的逆元定义为 `a^-1` ，即满足：  


```
a * a^-1 ≡ 1 (mod p)
```


当 `p` 是质数时，可以使用费马小定理来计算逆元：  


```cpp
a^(p-1) ≡ 1 (mod p)
```


对两边同时乘以 `a^-1`，得到：  


```
a^(p-2) ≡ a^-1 (mod p)
```

因此可以通过快速幂计算 `a^(p-2) % p` 来得到 `a` 的逆元。  


```cpp
// 模逆元，mod 必须为质数，且 x 与 mod 互质
ll inv(ll x, ll mod) { //
  return qpow(x, mod - 2, mod); 
}
```


**除法**  


有了逆元之后，就可以进行除法运算了（需保证 b 与 mod 互质）。  


```cpp
// 模除法
ll Div(ll a, ll b, ll mod) {
  return a * inv(b, mod) % mod;
}
```


## 五、组合数  


组合数学在比赛中也经常会用到，下面介绍一下常见的组合数计算方法。  


排列组合常见的公式：  


```cpp
A(n, r) = n (n-1) … (n-r+1)
A(n, r) = n! / (n-r)!
C(n, r) = A(n, r) / r!
```


有了 `C(n, r) = A(n, r) / r!` 公式之后，就可以通过预处理阶乘和阶乘逆元来快速计算排列数和组合数。  
注意：若用费马小定理计算阶乘逆元，需要 mod 为质数，且预处理的 n 需小于 mod；否则当 n ≥ mod 时，A[n] 在模意义下为 0，逆元不存在。  


```cpp
vector<ll> A;  // 阶乘表
vector<ll> RA; // 阶乘逆元表

void InitA(int n, int mod) {
  A.resize(n + 1);
  A[0] = 1;

  for (int i = 1; i <= n; i++) {
    A[i] = (A[i - 1] * i) % mod;
  }

  RA.resize(n + 1);
  for (int i = 0; i <= n; i++) {
    RA[i] = inv(A[i], mod);
  }
}

ll C(ll n, ll r, ll mod) {
  if (r < 0 || r > n) return 0;
  ll Anr = A[n] * RA[n - r] % mod;
  return Anr * RA[r] % mod;
}
```


## 六、最后  


好了，以上就是我打算分享的关于 CSP-J/S 可能会用到的一些数学知识。  


由于篇幅关系，很多内容只能介绍一些皮毛。  
后面我也会深入的分享一些数学相关的算法和题目。  
希望这些内容能对你们的比赛有所帮助！  







《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
