---
kind: algorithm
title: 标准 Young 表的 hook-length 公式
updated: 2026-10-12
status: draft
order: 1090600
tags:
  - 组合数学
  - 特殊数列
---

分拆 $\lambda=(\lambda_1\ge\cdots\ge\lambda_r>0)$、$n=\sum_i\lambda_i$，共轭分拆 $\lambda_j'=|\{i:\lambda_i\ge j\}|$。单元 $(i,j)$ 钩长


$$
h_{ij}=\lambda_i-j+\lambda_j'-i+1.
$$


标准 Young 表（行和列严格递增）的数量


$$
f^\lambda=\frac{n!}{\prod_{(i,j)\in\lambda}h_{ij}}.
$$


矩形 $a\times b$ 的特例：$f^{(b^a)}=(ab)!\prod_{i=0}^{a-1}\frac{i!}{(b+i)!}$。$2\times n$ 矩形给 $f^{(n,n)}=C_n$。


**用法**：给定 Young 图（例如形状 $(3,2)$）并按行列严格递增填入 $1,\ldots,n$ 时用上述钩长公式；有根树祖先先于后代则用 9.5 的**子树大小乘积**，两种钩长不能混用；非普通分拆形状的任意斜 Young 图也不能直接使用 9.6 的乘积公式。
