export function sticky(node: any, callback: (e: boolean) => void) {
	const stickToTop = true;
	const intersectionCallback: IntersectionObserverCallback = function (entries) {
		// only observing one item at a time
		const entry = entries[0];

		let isStuck = false;
		if (!entry.isIntersecting && isValidYPosition(entry)) {
			isStuck = true;
		}
		console.log(isStuck);
		callback(isStuck);
	};

	const isValidYPosition = function ({
		target,
		boundingClientRect
	}: {
		target: EventTarget;
		boundingClientRect: DOMRect;
	}) {
		if (target === stickySentinelTop) {
			return boundingClientRect.y < 0;
		} else {
			return boundingClientRect.y > 0;
		}
	};

	const mutationCallback: MutationCallback = function (mutations) {
		// If something changes and the sentinel nodes are no longer first and last child, put them back in position
		mutations.forEach(function (mutation) {
			const { parentNode: topParent } = stickySentinelTop;
			const { parentNode: bottomParent } = stickySentinelBottom;

			if (stickySentinelTop !== topParent?.firstChild) {
				topParent?.prepend(stickySentinelTop);
			}
			if (stickySentinelBottom !== bottomParent?.lastChild) {
				bottomParent?.append(stickySentinelBottom);
			}
		});
	};

	const intersectionObserver = new IntersectionObserver(intersectionCallback, {});
	const mutationObserver = new MutationObserver(mutationCallback);

	// we insert and observe a sentinel node immediately after the target
	// when it is visible, the target node cannot be sticking
	const stickySentinelTop = document.createElement('div');
	stickySentinelTop.classList.add('stickySentinelTop');
	// without setting a height, Safari breaks
	stickySentinelTop.style.position = 'absolute';
	stickySentinelTop.style.height = '1px';
	node.parentNode.prepend(stickySentinelTop);

	const stickySentinelBottom = document.createElement('div');
	stickySentinelBottom.classList.add('stickySentinelBottom');
	stickySentinelBottom.style.position = 'absolute';
	stickySentinelBottom.style.height = '1px';
	node.parentNode.append(stickySentinelBottom);

	if (stickToTop) {
		intersectionObserver.observe(stickySentinelTop);
	} else {
		intersectionObserver.observe(stickySentinelBottom);
	}

	mutationObserver.observe(node.parentNode, { childList: true });

	return {
		update({ stickToTop }: { stickToTop: boolean }) {
			// change which sentinel we are observing
			if (stickToTop) {
				intersectionObserver.unobserve(stickySentinelBottom);
				intersectionObserver.observe(stickySentinelTop);
			} else {
				intersectionObserver.unobserve(stickySentinelTop);
				intersectionObserver.observe(stickySentinelBottom);
			}
		},

		destroy() {
			intersectionObserver.disconnect();
			mutationObserver.disconnect();
		}
	};
}
