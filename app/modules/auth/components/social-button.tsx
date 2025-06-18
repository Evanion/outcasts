import { Button } from "~/components/ui/button";
import { FaBattleNet } from "react-icons/fa6";
import type { Provider } from "../enums/provider.enum";

const icons: Record<Provider, React.ReactElement> = {
  bnet: <FaBattleNet />,
};

export type SocialButtonProps = React.ComponentProps<typeof Button> & {
  provider: Provider;
};

export function SocialButton({ provider, ...props }: SocialButtonProps) {
  return (
    <Button {...props} value={provider} variant={provider} size="lg">
      {icons[provider]} Login with{" "}
      {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </Button>
  );
}
