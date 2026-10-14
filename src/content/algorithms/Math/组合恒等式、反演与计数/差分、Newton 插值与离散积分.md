---
kind: algorithm
title: 差分、Newton 插值与离散积分
updated: 2026-10-12
status: draft
order: 1010600
tags:
  - 组合数学
  - 计数
---

$$
\Delta f(x)=f(x+1)-f(x),\qquad \Delta\binom xk=\binom{x}{k-1}.
$$


$$
f(x)=\sum_{k=0}^d\Delta^kf(0)\binom xk\quad(\deg f\le d),
$$


$$
\Delta^kf(0)=\sum_{j=0}^k(-1)^{k-j}\binom kj f(j),\qquad \sum_{x=0}^{n-1}\binom xk=\binom n{k+1}.
$$


$$
\sum_{x=0}^{n-1}f(x)=\sum_{k=0}^d\Delta^kf(0)\binom n{k+1}.
$$


在特征为 $p$ 的域中直接使用 $\binom xk=x^{\underline k}/k!$ 须保证 $k<p$。不能仅凭有限个样本的高阶差分为零推断无限序列是多项式。
