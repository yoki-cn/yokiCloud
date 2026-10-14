---
kind: algorithm
title: 避免连续 $k$ 个相同字符的二元串
updated: 2026-10-12
status: draft
order: 1100800
tags:
  - 博弈论
---

$k\ge2$，$D_k(n)$ 为长度为 $n$、字母表为两个字符且无长度为 $k$ 的单色连续段的串数：


$$
D_k(0)=1,\qquad D_k(n)=2^n\quad(1\le n<k),\qquad D_k(k)=2^k-2,
$$


$$
\boxed{D_k(n)=2D_k(n-1)-D_k(n-k)\qquad(n>k).}
$$


也可对 $n\ge k$ 使用按末端“最后一段同色连续长度”分类的 $k-1$ 阶递推


$$
D_k(n)=D_k(n-1)+D_k(n-2)+\cdots+D_k(n-k+1)\quad(n\ge k),
$$


这条递推在 $n=k$ 及其后均成立。对应的普通生成函数（$k\ge2$）


$$
\boxed{\sum_{n\ge0}D_k(n)x^n=\frac{1+x+\cdots+x^{k-1}}{1-x-x^2-\cdots-x^{k-1}}.}
$$


按串是否为空及首尾同色连续段可推导，$k=1$ 是特殊情形 $D_1(0)=1,D_1(n)=0\ (n>0)$。
