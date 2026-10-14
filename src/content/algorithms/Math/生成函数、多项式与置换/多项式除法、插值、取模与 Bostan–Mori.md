---
kind: algorithm
title: 多项式除法、插值、取模与 Bostan–Mori
updated: 2026-10-12
status: draft
order: 1021300
tags:
  - 生成函数
  - 多项式
  - 群论
---

域上 $A=BQ+R$，$\deg R<\deg B$。快速除法可用反转多项式及形式逆求 $Q$，再求 $R=A-BQ$。

**Lagrange 插值**：不同节点 $x_0,\ldots,x_n$ 上 $y_i=f(x_i)$，$\deg f\le n$，


$$
f(x)=\sum_{i=0}^ny_i\prod_{j\ne i}\frac{x-x_j}{x_i-x_j}.
$$


等距节点 $x_i=i$ 时，令 $P(x)=\prod_{j=0}^n(x-j)$，则


$$
f(x)=\sum_{i=0}^n\frac{(-1)^{n-i}y_iP(x)}{(x-i)i!(n-i)!}.
$$


**Bostan–Mori**：若 $F(x)=P(x)/Q(x)$，$Q(0)\ne0$，$Q^-(x)=Q(-x)$，置 $U=P Q^-$，$V=Q Q^-$（$V$ 只含偶数次幂），则


$$
[x^n]\frac P Q=[x^{\lfloor n/2\rfloor}]\frac{U_{n\bmod2}(x)}{V_{\rm even}(x)},
$$


其中 $U_0(x)=\sum_j[x^{2j}]U(x)x^j$，$U_1(x)=\sum_j[x^{2j+1}]U(x)x^j$，$V_{\rm even}(x)=\sum_j[x^{2j}]V(x)x^j$；递归降 $n$，通常每层 $O(M(d))$。
