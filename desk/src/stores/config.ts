import { computed, ComputedRef } from "vue";
import { defineStore } from "pinia";
import { createResource } from "frappe-ui";
import { socket } from "@/socket";

export const useConfigStore = defineStore("config", () => {
  const configRes = createResource({
    url: "helpdesk.api.config.get_config",
    auto: true,
  });

  const config = computed(() => configRes.data || {});
  const brandLogo = computed(() => config.value.brand_logo);
  const skipEmailWorkflow: ComputedRef<boolean> = computed(
    () => !!parseInt(config.value.skip_email_workflow)
  );
  const preferKnowledgeBase = computed(
    () => !!parseInt(config.value.prefer_knowledge_base)
  );
  const isFeedbackMandatory = computed(
    () => !!parseInt(config.value.is_feedback_mandatory)
  );

  socket.on("helpdesk:settings-updated", () => configRes.reload());

  return {
    brandLogo,
    config,
    preferKnowledgeBase,
    skipEmailWorkflow,
    isFeedbackMandatory,
  };
});
