// Commit messages must never mention Claude or Anthropic. This blocks AI
// attribution such as "Co-Authored-By: Claude ..." trailers or
// "Generated with Claude Code" footers. Enforced by the husky commit-msg hook.
const AI_MENTION = /\b(claude|anthropic)\b/i;

export default {
   extends: ['@commitlint/config-conventional'],
   plugins: [
      {
         rules: {
            'no-ai-attribution': ({ raw }: { raw: string }) => {
               const match = AI_MENTION.exec(raw);
               return [
                  match === null,
                  `commit message must not mention "${match?.[0]}" (no AI attribution in commits)`,
               ];
            },
         },
      },
   ],
   rules: {
      'no-ai-attribution': [2, 'always'],
   },
};
