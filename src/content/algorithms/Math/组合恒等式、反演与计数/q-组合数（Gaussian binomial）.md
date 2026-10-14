---
kind: algorithm
title: $q$-组合数（Gaussian binomial）
updated: 2026-10-12
status: draft
order: 1011300
tags:
  - 组合数学
  - 计数
---

$$
\genfrac{[}{]}{0pt}{}{n}{k}_q=\prod_{i=0}^{k-1}\frac{q^{n-i}-1}{q^{k-i}-1},
$$


$$
\genfrac{[}{]}{0pt}{}{n}{k}_q=\genfrac{[}{]}{0pt}{}{n-1}{k-1}_q+q^k\genfrac{[}{]}{0pt}{}{n-1}{k}_q,
$$


$$
\prod_{i=0}^{n-1}(1+q^ix)=\sum_{k=0}^nq^{k(k-1)/2}\genfrac{[}{]}{0pt}{}{n}{k}_qx^k.
$$


$q$ 为素数幂时，上式计数 $\mathbb F_q^n$ 的 $k$ 维线性子空间；作为形式多项式定义时不要求可逆除法。
