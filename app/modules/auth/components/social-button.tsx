import { Button } from "~/components/ui/button";
import { FaBattleNet } from "react-icons/fa6";
import type { Provider } from "../enums/provider.enum";
import { useTranslation } from "react-i18next";

const icons: Record<Provider, React.ReactElement> = {
  bnet: <FaBattleNet />,
};

export type SocialButtonProps = React.ComponentProps<typeof Button> & {
  provider: Provider;
};

export function SocialButton({ provider, ...props }: SocialButtonProps) {
  const { t } = useTranslation("auth");
  return (
    <Button {...props} value={provider} variant={provider} size="lg">
      {icons[provider]} {t(`SOCIAL_AUTH_${provider.toUpperCase()}`)}
    </Button>
  );
}
