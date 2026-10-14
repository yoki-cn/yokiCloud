---
kind: algorithm
title: Fermat、Wilson、Lucas 与 Kummer
updated: 2026-10-12
status: draft
order: 1050800
tags:
  - 数论
---

素数 $p$：


$$
a^p\equiv a\pmod p,\quad a^{p-1}\equiv1\pmod p\ (p\nmid a),\quad(p-1)!\equiv-1\pmod p.
$$


Lucas 定理：将非负整数 $n,k$ 按 $p$ 进制展开 $n=\sum n_ip^i,k=\sum k_ip^i$，则


$$
\binom nk\equiv\prod_i\binom{n_i}{k_i}\pmod p.
$$


Kummer 定理：$v_p(\binom nk)$ 等于 $k$ 与 $n-k$ 在 $p$ 进制相加时的进位次数。


$$
v_p(n!)=\sum_{j\ge1}\left\lfloor\frac n{p^j}\right\rfloor=\frac{n-s_p(n)}{p-1},
$$


其中 $s_p(n)$ 是各 $p$ 进制数字之和。Lucas 直接应用仅适用于**素数模数**；素数幂模数需广义 Lucas（去掉 $p$ 倍因子的阶乘）或类似处理。
