---
kind: algorithm
title: OGF、EGF、卷积和序列构造
updated: 2026-10-12
status: draft
order: 1020100
tags:
  - 生成函数
  - 多项式
  - 群论
---

普通生成函数（OGF）$A(x)=\sum_{n\ge0}a_nx^n$；指数生成函数（EGF）$\widehat A(x)=\sum_{n\ge0}a_nx^n/n!$。


$$
[x^n]A(x)B(x)=\sum_{k=0}^n a_kb_{n-k},
$$


$$
n![x^n]\widehat A(x)\widehat B(x)=\sum_{k=0}^n\binom nk a_kb_{n-k}.
$$


OGF 适合长度合并/非标号结构；EGF 适合标号集合拆分。标号结构的 `SEQ`、`SET`、`CYC` 对应


$$
\operatorname{SEQ}(A):\frac1{1-A(x)},\quad\operatorname{SET}(A):e^{A(x)},\quad\operatorname{CYC}(A):\log\frac1{1-A(x)},
$$


其中组件不能含空对象，即 $A(0)=0$。无标号多重集合的 OGF 通常为 $\prod_{j\ge1}(1-x^j)^{-a_j}$（整数 $a_j\ge0$）。
