---
kind: algorithm
title: 随机游走、图上 hitting time 与 commute time
updated: 2026-10-12
status: draft
order: 1062300
tags:
  - 概率
  - 期望
---

无向连通电阻网络，边权表示**电导** $w_e>0$，$m_w=\sum_e w_e$，简单可逆随机游走按电导比例走，节点 $u,v$ 的 commute time 为


$$
H(u,v)+H(v,u)=2m_wR_{\rm eff}(u,v).
$$


这里 $H(u,v)$ 是首次从 $u$ 击中 $v$ 的预期步数，$R_{\rm eff}$ 使用电阻 $1/w_e$。有向非可逆随机游走一般不能套该公式。
无权无向树每步从相邻节点中等概率选取，固定根 $r$ 为吸收点；$\operatorname{sub}(u)$ 表示以 $r$ 为根时 $u$ 的子树节点数，则非根 $u$ 首次走到其父亲 $\operatorname{pa}(u)$ 的期望为


$$
\boxed{H(u,\operatorname{pa}(u))=2\operatorname{sub}(u)-1,\quad H(u,r)=\sum_{v\in\operatorname{path}(u,r)\setminus\{r\}}\bigl(2\operatorname{sub}(v)-1\bigr).}
$$


这是**无权无向树的均匀邻点随机游走**专用公式；有向、边权转移、非树图不能照搬。自底向上求子树大小、再自顶向下求每个点的答案，总时间 $O(n)$。
