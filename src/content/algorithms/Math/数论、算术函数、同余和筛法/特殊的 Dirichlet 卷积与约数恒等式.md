---
kind: algorithm
title: 特殊的 Dirichlet 卷积与约数恒等式
updated: 2026-10-12
status: draft
order: 1052100
tags:
  - 数论
---

用 $\tau(n)=\sum_{d\mid n}1$、$\sigma_k(n)=\sum_{d\mid n}d^k$、$\omega(n)$ 表示不同质因子个数。对 $n,u,v\ge1$：


$$
\boxed{\sum_{d\mid n}2^{\omega(d)}=\tau(n^2),\qquad\sum_{d\mid n}\tau(d^2)=\tau(n)^2,}
$$


$$
\sum_{d\mid n}\frac{\mu(d)}{d}=\frac{\varphi(n)}n,\qquad \sum_{d\mid n}\frac{\mu(d)^2}{\varphi(d)}=\frac{n}{\varphi(n)},
$$


$$
\sum_{d\mid n}\varphi(d)\tau(n/d)=\sigma_1(n),
$$


$$
\tau(uv)=\sum_{d\mid\gcd(u,v)}\mu(d)\tau(u/d)\tau(v/d),
$$


$$
\sigma_k(u)\sigma_k(v)=\sum_{d\mid\gcd(u,v)}d^k\sigma_k(uv/d^2)\qquad(k\ge0).
$$


利用两边的积性，可按单个质数幂验证上式。**注意**：$\sum_{d\mid n}\mu(d)/\varphi(d)=\tau(n)$ 不是恒等式：如 $n=2$ 时左边为 $0$，右边为 $2$。
