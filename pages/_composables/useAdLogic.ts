import { computed, onBeforeMount, ref } from "vue";

const AD_SLOT_ID = "2610490971";

function createBaitElement() {
  const element = document.createElement("div");
  element.setAttribute(
    "class",
    "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links",
  );
  element.setAttribute(
    "style",
    "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;",
  );
  document.body.appendChild(element);
  return element;
}

function checkForAdblock(): Promise<boolean> {
  return new Promise((resolve) => {
    const bait = createBaitElement();
    setTimeout(() => {
      const style = window.getComputedStyle(bait, null);
      const hasDetectedAd =
        style.getPropertyValue("display") === "none" ||
        style.getPropertyValue("visibility") === "hidden";
      const adElement = document.querySelector(".adsbygoogle");
      const didNotLoadAnalytics =
        adElement instanceof HTMLElement ? adElement.dataset.adsbygoogleStatus !== "done" : true;
      document.body.removeChild(bait);
      resolve(hasDetectedAd || didNotLoadAnalytics);
    }, 1);
  });
}

export function useAdLogic(_currentPath: string) {
  const notInLegalView = computed(() => true);
  const hasAdblock = ref(false);

  onBeforeMount(() => {
    window.addEventListener(
      "load",
      async () => {
        hasAdblock.value = await checkForAdblock();
      },
      { once: true },
    );
  });

  return {
    hasAdblock,
    notInLegalView,
    adSlotId: AD_SLOT_ID,
  };
}
