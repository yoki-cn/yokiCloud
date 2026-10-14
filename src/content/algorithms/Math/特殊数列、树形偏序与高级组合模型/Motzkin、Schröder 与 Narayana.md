---
kind: algorithm
title: Motzkin、Schröder 与 Narayana
updated: 2026-10-12
status: draft
order: 1090400
tags:
  - 组合数学
  - 特殊数列
---

Motzkin 数 $M_n$ 计数长度 $n$、步长 $+1,0,-1$、所有前缀高度非负、最终高度 $0$ 的路径：


$$
M_0=M_1=1,\quad M_n=M_{n-1}+\sum_{k=0}^{n-2}M_kM_{n-2-k}\quad(n\ge2),
$$


$$
M_n=\sum_{k=0}^{\lfloor n/2\rfloor}\binom{n}{2k}C_k,\quad M(x)=1+xM(x)+x^2M(x)^2,
$$


$$
M(x)=\frac{1-x-\sqrt{1-2x-3x^2}}{2x^2}.
$$


大 Schröder 数 $R_0=1,R_1=2,R_2=6,\ldots$，


$$
R(x)=1+xR(x)+xR(x)^2,\qquad R(x)=\frac{1-x-\sqrt{1-6x+x^2}}{2x}.
$$


Narayana 数（$n\ge1,1\le k\le n$）是 Dyck 路径按峰数细分 Catalan 的数量：


$$
N(n,k)=\frac1n\binom nk\binom n{k-1},\qquad\sum_{k=1}^nN(n,k)=C_n.
$$



**Narayana 的精细模型与边界**：Dyck 路径按**峰** $UD$ 的数量计数，等价于合法括号序列中相邻子串 `()` 的个数；在标准 Dyck 路径与有根有序树双射下，等于具有 $n$ 条边的有根有序树恰有 $k$ 个叶子的数量：


$$
N(0,0)=1,\qquad N(n,k)=\frac1n\binom nk\binom n{k-1}\quad(1\le k\le n),\qquad N(n,k)=N(n,n+1-k).
$$


$N(4,1),\ldots,N(4,4)=(1,6,6,1)$，和为 $C_4=14$。**何时用**：普通 Dyck 路径、括号序列或有序树计数用 Catalan；额外要求峰数、相邻 `()` 数或叶子数恰为 $k$ 才用 Narayana。小范围时可使用已有组合数接口 `comb.C(n,k)`：

```cpp
template<class Z, class Comb>
Z narayana(int n, int k, Comb &comb) {
    if (n == 0) return Z(k == 0);
    if (k < 1 || k > n) return 0;
    return comb.C(n, k) * comb.C(n, k - 1) / Z(n);
}
```

模意义下的 `/ Z(n)` 仅在 $\gcd(n,\mathrm{mod})=1$ 时合法；使用普通质数模阶乘表还需 $n<\mathrm{mod}$。模数与 $n$ 不互质时，必须先精确整除或改用适合的组合数计算方式。
