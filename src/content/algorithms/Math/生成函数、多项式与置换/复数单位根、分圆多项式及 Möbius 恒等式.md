---
kind: algorithm
title: 复数单位根、分圆多项式及 Möbius 恒等式
updated: 2026-10-12
status: draft
order: 1021800
tags:
  - 生成函数
  - 多项式
  - 群论
---

设 $\zeta_n=e^{2\pi i/n}$，$\Phi_n(x)$ 为第 $n$ 个分圆多项式，$n\ge1$：


$$
x^n-1=\prod_{d\mid n}\Phi_d(x),\quad\Phi_n(x)=\prod_{d\mid n}(x^d-1)^{\mu(n/d)},\quad\deg\Phi_n=\varphi(n).
$$


乘积中的负指数**作为有理函数先约分**，结果是整系数多项式。基本特例


$$
\Phi_1(x)=x-1,\quad\Phi_{p}(x)=1+x+\cdots+x^{p-1}\quad(p\text{ 素数}),
$$


$$
\prod_{\substack{1\le k\le n\\(k,n)=1}}(x-\zeta_n^k)=\Phi_n(x).
$$


对于复单位根筛 $[n\mid k]=\frac1n\sum_{j=0}^{n-1}\zeta_n^{jk}$；模域应用必须有原始 $n$ 次单位根且 $n$ 在域里可逆。
