---
kind: algorithm
title: Jordan 函数、Liouville 函数与 Ramanujan 和
updated: 2026-10-12
status: draft
order: 1050600
tags:
  - 数论
---

$$
J_k(n)=n^k\prod_{p\mid n}(1-p^{-k})=\sum_{d\mid n}\mu(d)(n/d)^k,\quad\sum_{d\mid n}J_k(d)=n^k.
$$


$$
\lambda_{\rm L}(n)=(-1)^{\Omega(n)},\qquad\sum_{d\mid n}\lambda_{\rm L}(d)=[n\text{ 是完全平方数}].
$$


其中 $\Omega(n)$ 是按重数计的素因子个数，区别于 Carmichael 的 $\lambda(n)$。

Ramanujan 和（$q\ge1$）：


$$
c_q(n)=\sum_{\substack{1\le k\le q\\\gcd(k,q)=1}}e^{2\pi i kn/q}=\sum_{d\mid\gcd(q,n)}d\mu(q/d)=\mu\!\left(\frac qg\right)\frac{\varphi(q)}{\varphi(q/g)},\quad g=\gcd(q,n).
$$
